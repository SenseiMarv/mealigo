import { defaultPlugins, defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "https://demo.mealie.io/openapi.json",
  output: "src/api/gen",
  plugins: [
    ...defaultPlugins,
    {
      name: "@hey-api/sdk",
      validator: "zod",
      transformer: "zod",
    },
    {
      name: "@hey-api/client-fetch",
      baseUrl: false, // The demo instance sets a base URL; requests use the set Mealie server URL.
    },
    "@tanstack/react-query",
    "zod",
  ],
});
