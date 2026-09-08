import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Button,
  HeroUINativeConfig,
  HeroUINativeProvider,
} from "heroui-native";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient({});

const heroUiConfig: HeroUINativeConfig = {
  devInfo: {
    stylingPrinciples: false,
  },
};

export default function Index() {
  useReactQueryDevTools(queryClient);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider config={heroUiConfig}>
        <QueryClientProvider client={queryClient}>
          <MyComponent />
        </QueryClientProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}

function MyComponent() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Button onPress={() => console.log("Pressed!")}>Get Started</Button>
    </View>
  );
}
