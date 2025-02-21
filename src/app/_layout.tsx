import { useFonts } from "expo-font";
import { Slot, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import useRootStore from "../hooks/stores/useRootstore";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "../../globals.css";
import Alert from "../components/shared/Alert";
import OngoingSubmission from "../components/shared/OngoingSubmission";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
	const [loaded] = useFonts({
		BarlowExtraLight: require("../assets/fonts/Barlow-ExtraLight.ttf"),
		BarlowLight: require("../assets/fonts/Barlow-Light.ttf"),
		BarlowThin: require("../assets/fonts/Barlow-Thin.ttf"),
		BarlowRegular: require("../assets/fonts/Barlow-Regular.ttf"),
		BarlowMedium: require("../assets/fonts/Barlow-Medium.ttf"),
		BarlowSemiBold: require("../assets/fonts/Barlow-SemiBold.ttf"),
		BarlowBold: require("../assets/fonts/Barlow-Bold.ttf"),
		BarlowExtraBold: require("../assets/fonts/Barlow-ExtraBold.ttf"),
		BarlowBlack: require("../assets/fonts/Barlow-Black.ttf"),
	});
	const { statusBarStyle, setStatusBarStyle } = useRootStore();
	const pathname = usePathname();

	useEffect(() => {
		const lightScreens = ["/dashboard", "/wallet", "/account"];
		const isLight = lightScreens.some((s) => pathname.startsWith(s));

		if (isLight) {
			setStatusBarStyle("light");
		} else {
			setStatusBarStyle("dark");
		}
	}, [pathname]);

	const onLayoutRootView = useCallback(async () => {
		if (loaded) {
			await SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<QueryClientProvider client={queryClient}>
			<OngoingSubmission />
			<SafeAreaProvider>
				<GestureHandlerRootView>
					<Alert />
					<StatusBar style={statusBarStyle} />
					<View onLayout={onLayoutRootView}></View>
					<Slot />
				</GestureHandlerRootView>
			</SafeAreaProvider>
		</QueryClientProvider>
	);
}
