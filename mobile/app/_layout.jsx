import ErrorBoundary from "@/components/ErrorBoundary";
import SafeScreen from "@/components/SafeScreen";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import Constants from "expo-constants";
import { Slot } from "expo-router";

const CLERK_PUBLISHABLE_KEY = Constants.expoConfig?.extra?.clerkPublishableKey;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
        <SafeScreen>
          <Slot />
        </SafeScreen>
      </ClerkProvider>
    </ErrorBoundary>
  );
}
