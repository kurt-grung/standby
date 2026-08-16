.DEFAULT_GOAL := help

APP_DIR := app
CONFIGURATOR_DIR := configurator
ROOT := $(abspath $(CURDIR))
EXPO_PORT ?= 8081
WEB_PORT ?= 8082
CONFIGURATOR_PORT ?= 5173
IOS_DEVICE ?= K Phone
IOS_TEAM_ID ?= 85FP2SN2JN

define require_app
	@if [ ! -f "$(ROOT)/$(APP_DIR)/package.json" ]; then \
		echo "Missing $(APP_DIR)/package.json"; \
		exit 1; \
	fi
endef

.PHONY: help install i app run start s dev ios device standby android web configurator configurator-build kill clean prebuild rebuild tsc typecheck compat doc verify check c audit fix format f hooks reload brand-assets connect \
	eas-init eas-build-dev eas-build-dev-device eas-build-preview eas-build-production eas-submit

EAS ?= eas
EAS_BUILD_FLAGS ?=

help: ## Show available commands
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-18s\033[0m %s\n", $$1, $$2}'

install: ## Install app dependencies
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && npm install

i: install ## Shorthand for install

app: ios ## Build native app and run on iOS simulator

run: ## Start Expo dev server (Metro) for the dev client
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && node scripts/patch-dev-client-url.mjs
	cd "$(ROOT)/$(APP_DIR)" && npm run start -- --dev-client --port $(EXPO_PORT) --lan

start s: run ## Alias for run

connect: ## Ensure Metro, patch LAN URL, and connect the dev client
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && node scripts/connect-dev-client.mjs

ios: ## Build native app and run on iOS simulator (widgets need this, not Expo Go)
	$(call require_app)
	@rm -f "$(ROOT)/$(APP_DIR)/ios/.xcode.env.updates"
	cd "$(ROOT)/$(APP_DIR)" && node scripts/patch-dev-launcher-autoconnect.mjs
	cd "$(ROOT)/$(APP_DIR)" && node scripts/patch-dev-client-url.mjs
	cd "$(ROOT)/$(APP_DIR)" && node scripts/ensure-dev-server.mjs
	cd "$(ROOT)/$(APP_DIR)" && node scripts/sync-ios-widget-catalog.mjs
	cd "$(ROOT)/$(APP_DIR)" && node scripts/ensure-expo-widgets-bundle.mjs
	cd "$(ROOT)/$(APP_DIR)" && node scripts/ensure-ios-bundle-id.mjs && EXPO_APPLE_TEAM_ID="$(IOS_TEAM_ID)" npm run ios

dev: ## Live dev: Metro on LAN + open iOS simulator dev client
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && node scripts/patch-dev-client-url.mjs
	cd "$(ROOT)/$(APP_DIR)" && npm run start -- --dev-client --port $(EXPO_PORT) --lan --ios

device: ## Dev build on iPhone — Metro auto-connect (no embedded bundle)
	$(call require_app)
	@rm -f "$(ROOT)/$(APP_DIR)/ios/.xcode.env.updates"
	cd "$(ROOT)/$(APP_DIR)" && node scripts/patch-dev-launcher-autoconnect.mjs
	cd "$(ROOT)/$(APP_DIR)" && node scripts/patch-dev-client-url.mjs
	cd "$(ROOT)/$(APP_DIR)" && node scripts/ensure-dev-server.mjs
	cd "$(ROOT)/$(APP_DIR)" && node scripts/sync-ios-widget-catalog.mjs
	cd "$(ROOT)/$(APP_DIR)" && node scripts/ensure-expo-widgets-bundle.mjs
	cd "$(ROOT)/$(APP_DIR)" && node scripts/ensure-ios-bundle-id.mjs && EXPO_APPLE_TEAM_ID="$(IOS_TEAM_ID)" npx expo run:ios --device "$(IOS_DEVICE)"
	cd "$(ROOT)/$(APP_DIR)" && IOS_DEVICE="$(IOS_DEVICE)" node scripts/connect-dev-client.mjs
	@echo ""
	@echo "App should open straight into StandBy+ via Metro. Open once so widgets register;"
	@echo "re-add StandBy widgets if they still show red squares."

standby: ## Release build on iPhone — best for StandBy widgets (no Metro required)
	$(call require_app)
	@rm -f "$(ROOT)/$(APP_DIR)/ios/.xcode.env.updates"
	cd "$(ROOT)/$(APP_DIR)" && node scripts/sync-ios-widget-catalog.mjs
	cd "$(ROOT)/$(APP_DIR)" && node scripts/ensure-expo-widgets-bundle.mjs
	cd "$(ROOT)/$(APP_DIR)" && node scripts/ensure-ios-bundle-id.mjs && EXPO_APPLE_TEAM_ID="$(IOS_TEAM_ID)" npx expo run:ios --device "$(IOS_DEVICE)" --configuration Release
	@echo ""
	@echo "Open Standby once, then add Widget Left and Widget Right in StandBy."

android: ## Build native app and run on Android
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && npm run android

web: ## Start Expo for web (app/) on port $(WEB_PORT)
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && npx expo start --web --port $(WEB_PORT)

configurator: ## Start widget configurator UI (configurator/)
	@if [ ! -f "$(ROOT)/$(CONFIGURATOR_DIR)/package.json" ]; then echo "Missing $(CONFIGURATOR_DIR)/package.json"; exit 1; fi
	cd "$(ROOT)/$(CONFIGURATOR_DIR)" && npm install && npm run dev -- --port $(CONFIGURATOR_PORT)

configurator-build: ## Production build for widget configurator (configurator/)
	@if [ ! -f "$(ROOT)/$(CONFIGURATOR_DIR)/package.json" ]; then echo "Missing $(CONFIGURATOR_DIR)/package.json"; exit 1; fi
	cd "$(ROOT)/$(CONFIGURATOR_DIR)" && npm install && npm run build

prebuild: ## Generate ios/ native project and widget extension
	$(call require_app)
	@rm -f "$(ROOT)/$(APP_DIR)/ios/.xcode.env.updates"
	cd "$(ROOT)/$(APP_DIR)" && node scripts/ensure-ios-bundle-id.mjs && EXPO_APPLE_TEAM_ID="$(IOS_TEAM_ID)" npm run prebuild

rebuild: clean install prebuild ## Clean caches, reinstall, and prebuild iOS

tsc typecheck: ## Typecheck the app
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && npx tsc --noEmit

compat: ## Check Expo SDK 57 router compatibility and dependency versions
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && npm run compat

doc: ## Run expo-doctor project health checks
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && npm run doc

verify: ## Fast app checks before commit (typecheck + Expo compat)
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && npm run verify

reload: ## Reload connected Expo dev client (Metro must be running: make dev)
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && npm run reload

check: ## Read-only checks (verify + Prettier)
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && npm run check

c: check ## Shorthand for check

audit: ## Full static audit before push or dependency updates
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && npm run audit

fix: ## Auto-fix Expo deps, router imports, and patches
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && npm run fix

format: ## Format app source with Prettier
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && npm run format

brand-assets: ## Regenerate icon, adaptive icon, splash, and iOS splash imageset from branding masters
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && npm run assets:generate

f: format ## Shorthand for format

hooks: ## Install local git pre-commit hook for app verification
	@mkdir -p "$(ROOT)/.git/hooks"
	@ln -sf "$(ROOT)/.githooks/pre-commit" "$(ROOT)/.git/hooks/pre-commit"
	@chmod +x "$(ROOT)/.githooks/pre-commit"
	@echo "Installed pre-commit hook → runs 'make check' when app/ changes are staged."

clean: ## Remove Expo / Metro caches (keeps node_modules and ios/)
	@rm -rf "$(ROOT)/$(APP_DIR)/.expo" \
		"$(ROOT)/$(APP_DIR)/dist" \
		"$(ROOT)/$(APP_DIR)/web-build" \
		"$(ROOT)/$(APP_DIR)/node_modules/.cache"
	@rm -f "$(ROOT)/$(APP_DIR)/.metro-health-check"* "$(ROOT)/$(APP_DIR)"/*.tsbuildinfo
	@echo "Cleaned Expo caches."

kill: ## Stop Expo / Metro dev servers and stale iOS builds for this repo
	@echo "Killing listeners on $(EXPO_PORT) $(WEB_PORT) $(CONFIGURATOR_PORT) 19000–19002 19006…"
	@for p in $(EXPO_PORT) $(WEB_PORT) $(CONFIGURATOR_PORT) 19000 19001 19002 19006; do \
		kill -9 $$(lsof -tiTCP:$$p -sTCP:LISTEN 2>/dev/null) 2>/dev/null || true; \
	done
	@for pattern in \
		"$(ROOT)/$(APP_DIR)/node_modules/.bin/expo" \
		"$(ROOT)/$(APP_DIR).*expo start" \
		"$(ROOT)/$(APP_DIR).*expo run:ios" \
		"$(ROOT)/$(APP_DIR).*metro"; do \
		pgrep -f "$$pattern" 2>/dev/null | xargs kill -TERM 2>/dev/null || true; \
	done
	@pgrep -f "xcodebuild.*Standby" 2>/dev/null | xargs kill -TERM 2>/dev/null || true
	@sleep 1
	@for pattern in \
		"$(ROOT)/$(APP_DIR)/node_modules/.bin/expo" \
		"$(ROOT)/$(APP_DIR).*expo start" \
		"$(ROOT)/$(APP_DIR).*expo run:ios" \
		"$(ROOT)/$(APP_DIR).*metro"; do \
		pgrep -f "$$pattern" 2>/dev/null | xargs kill -KILL 2>/dev/null || true; \
	done
	@pgrep -f "xcodebuild.*Standby" 2>/dev/null | xargs kill -KILL 2>/dev/null || true
	@echo "Stopped dev servers."

eas-init: ## Link project to Expo (run once)
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && node scripts/ensure-expo-account.mjs && $(EAS) init

eas-build-dev: ## EAS build — iOS simulator dev client
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && node scripts/ensure-expo-account.mjs && $(EAS) build --profile development --platform ios $(EAS_BUILD_FLAGS)

eas-build-dev-device: ## EAS build — iOS device dev client
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && node scripts/ensure-expo-account.mjs && $(EAS) build --profile development-device --platform ios $(EAS_BUILD_FLAGS)

eas-build-preview: ## EAS build — internal preview (TestFlight-ready)
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && node scripts/ensure-expo-account.mjs && $(EAS) build --profile preview --platform ios $(EAS_BUILD_FLAGS)

eas-build-production: ## EAS build — App Store production
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && node scripts/ensure-expo-account.mjs && $(EAS) build --profile production --platform ios $(EAS_BUILD_FLAGS)

eas-submit: ## Submit latest production build to App Store
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && node scripts/ensure-expo-account.mjs && $(EAS) submit --profile production --platform ios $(EAS_BUILD_FLAGS)
