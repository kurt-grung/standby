import { ensureDevServer } from './metro-dev.mjs';

const result = await ensureDevServer({
  openSimulator: process.env.EXPO_OPEN_IOS === '1',
});

if (result.started) {
  console.log(`Started Metro on port ${result.port}. Log: app/.expo-dev-server.log`);
  if (result.launched > 0) {
    console.log(`Opened dev client on ${result.launched} booted simulator(s).`);
  }
} else {
  console.log(`Metro already running on port ${result.port}.`);
}
