import { Slot } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import SafeScreen from "@/components/SafeScreen";

const CLERK_PUBLISHABLE_KEY =
  "pk_test_ZXF1aXBwZWQtc3R1ZC03OC5jbGVyay5hY2NvdW50cy5kZXYk";

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <SafeScreen>
        <Slot />
      </SafeScreen>
    </ClerkProvider>
  );
}
