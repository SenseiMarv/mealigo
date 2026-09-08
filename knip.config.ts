import { defineConfig } from "knip/config";

export default defineConfig({
  ignore: [".agents/**"],
  ignoreDependencies: [
    "@dev-plugins/react-query",
    "@expo/ui",
    "expo-device",
    "expo-glass-effect",
    "expo-status-bar",
    "expo-symbols",
    "expo-web-browser",
    "expo-mcp",
    "expo-updates",
  ],
  treatConfigHintsAsErrors: true,
});
