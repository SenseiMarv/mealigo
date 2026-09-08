import {
  Button,
  HeroUINativeConfig,
  HeroUINativeProvider,
} from "heroui-native";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const heroUiConfig: HeroUINativeConfig = {
  devInfo: {
    stylingPrinciples: false,
  },
};

export default function Index() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider config={heroUiConfig}>
        <MyComponent />
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
