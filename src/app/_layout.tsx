import "../global.css";

import { useReactNavigationDevTools } from "@dev-plugins/react-navigation";
import { Stack, useNavigationContainerRef } from "expo-router";

export default function RootLayout() {
  const navigationRef = useNavigationContainerRef();

  useReactNavigationDevTools(navigationRef);

  return <Stack />;
}
