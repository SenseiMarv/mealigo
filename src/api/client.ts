import { fetch } from "expo/fetch";

import { createClient, type Config } from "./gen/client";

type MealieClientProps = { baseUrl: string };

/** Create a separate client for each Mealie server connection. */
export const createMealieClient = (config: Config & MealieClientProps) => {
  return createClient({
    ...config,
    fetch: config.fetch ?? fetch,
  });
};
