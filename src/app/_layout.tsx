import "../global.css";

import { useReactNavigationDevTools } from "@dev-plugins/react-navigation";
import { Slot, useNavigationContainerRef } from "expo-router";

export default function RootLayout() {
  const navigationRef = useNavigationContainerRef();

  useReactNavigationDevTools(navigationRef);

  return <Slot />;
}
