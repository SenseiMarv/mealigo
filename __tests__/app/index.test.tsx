import { renderRouter, screen } from "expo-router/testing-library";

import Index from "@/app/index";

describe("<Index />", () => {
  it("renders", async () => {
    renderRouter({ index: Index }, { initialUrl: "/" });

    expect(screen).toHavePathname("/");
    expect(screen.getByText("Get Started")).toBeOnTheScreen();
  });
});
