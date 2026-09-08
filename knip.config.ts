import { defineConfig } from "knip/config";

export default defineConfig({
  ignore: [".agents/**", "src/api/gen/**", "src/api/client.ts"],
  ignoreDependencies: [
    "@expo/ui",
    "expo-device",
    "expo-glass-effect",
    "expo-status-bar",
    "expo-symbols",
    "expo-web-browser",
    "expo-mcp",
    "expo-updates",
    "zod",
  ],
  treatConfigHintsAsErrors: true,
});
