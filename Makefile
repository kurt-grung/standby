.DEFAULT_GOAL := help

APP_DIR := app
ROOT := $(abspath $(CURDIR))
EXPO_PORT ?= 8081

define require_app
	@if [ ! -f "$(ROOT)/$(APP_DIR)/package.json" ]; then \
		echo "Missing $(APP_DIR)/package.json"; \
		exit 1; \
	fi
endef

.PHONY: help install i run start s ios android web kill clean prebuild rebuild tsc typecheck \
	eas-init eas-build-dev eas-build-dev-device eas-build-preview eas-build-production eas-submit

EAS ?= eas
EAS_BUILD_FLAGS ?=

help: ## Show available commands
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-18s\033[0m %s\n", $$1, $$2}'

install: ## Install app dependencies
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && npm install

i: install ## Shorthand for install

run: ## Start Expo dev server (Metro)
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && npm run start -- --port $(EXPO_PORT)

start s: run ## Alias for run

ios: ## Build native app and run on iOS simulator (widgets need this, not Expo Go)
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && npm run ios

android: ## Build native app and run on Android
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && npm run android

web: ## Start Expo for web
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && npm run web

prebuild: ## Generate ios/ native project and widget extension
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && npx expo prebuild --platform ios

rebuild: clean install prebuild ## Clean caches, reinstall, and prebuild iOS
	@if [ -f "$(ROOT)/$(APP_DIR)/ios/Podfile" ]; then \
		cd "$(ROOT)/$(APP_DIR)/ios" && pod install; \
	fi

tsc typecheck: ## Typecheck the app
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && npx tsc --noEmit

clean: ## Remove Expo / Metro caches (keeps node_modules and ios/)
	@rm -rf "$(ROOT)/$(APP_DIR)/.expo" \
		"$(ROOT)/$(APP_DIR)/dist" \
		"$(ROOT)/$(APP_DIR)/web-build" \
		"$(ROOT)/$(APP_DIR)/node_modules/.cache"
	@rm -f "$(ROOT)/$(APP_DIR)/.metro-health-check"* "$(ROOT)/$(APP_DIR)"/*.tsbuildinfo
	@echo "Cleaned Expo caches."

kill: ## Stop Expo / Metro dev servers for this repo
	@echo "Killing listeners on $(EXPO_PORT) 8082 19000–19002 19006…"
	@for p in $(EXPO_PORT) 8082 19000 19001 19002 19006; do \
		kill -9 $$(lsof -tiTCP:$$p -sTCP:LISTEN 2>/dev/null) 2>/dev/null || true; \
	done
	@for pattern in \
		"$(ROOT)/$(APP_DIR)/node_modules/.bin/expo" \
		"$(ROOT)/$(APP_DIR).*expo start" \
		"$(ROOT)/$(APP_DIR).*expo run:ios" \
		"$(ROOT)/$(APP_DIR).*metro"; do \
		pgrep -f "$$pattern" 2>/dev/null | xargs kill -TERM 2>/dev/null || true; \
	done
	@sleep 1
	@for pattern in \
		"$(ROOT)/$(APP_DIR)/node_modules/.bin/expo" \
		"$(ROOT)/$(APP_DIR).*expo start" \
		"$(ROOT)/$(APP_DIR).*expo run:ios" \
		"$(ROOT)/$(APP_DIR).*metro"; do \
		pgrep -f "$$pattern" 2>/dev/null | xargs kill -KILL 2>/dev/null || true; \
	done
	@echo "Stopped dev servers."

eas-init: ## Link project to Expo (run once)
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && $(EAS) init

eas-build-dev: ## EAS build — iOS simulator dev client
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && $(EAS) build --profile development --platform ios $(EAS_BUILD_FLAGS)

eas-build-dev-device: ## EAS build — iOS device dev client
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && $(EAS) build --profile development-device --platform ios $(EAS_BUILD_FLAGS)

eas-build-preview: ## EAS build — internal preview (TestFlight-ready)
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && $(EAS) build --profile preview --platform ios $(EAS_BUILD_FLAGS)

eas-build-production: ## EAS build — App Store production
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && $(EAS) build --profile production --platform ios $(EAS_BUILD_FLAGS)

eas-submit: ## Submit latest production build to App Store
	$(call require_app)
	cd "$(ROOT)/$(APP_DIR)" && $(EAS) submit --profile production --platform ios $(EAS_BUILD_FLAGS)
