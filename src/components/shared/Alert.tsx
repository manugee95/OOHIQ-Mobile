import React, { useEffect } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppText from "./AppText";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";
import useRootStore from "@/src/hooks/stores/useRootstore";

export default function Alert() {
	const { top } = useSafeAreaInsets();
	const transformY = useSharedValue(-50);
	const opacity = useSharedValue(0);
	const { alert } = useRootStore();

	const styles = useAnimatedStyle(() => ({
		transform: [{ translateY: transformY.value }],
		opacity: opacity.value,
	}));

	useEffect(() => {
		if (alert.show) {
			transformY.value = withTiming(0, {
				duration: 200,
			});
			opacity.value = withTiming(1, {
				duration: 200,
			});
		} else {
			transformY.value = withTiming(-50, {
				duration: 200,
			});
			opacity.value = withTiming(0, {
				duration: 200,
			});
		}
	}, [alert]);

	return (
		<View
			style={{ top: top + 30 }}
			className="absolute z-[999999999999] items-center justify-center w-full">
			<Animated.View
				style={[
					styles,
					{ backgroundColor: alert.type === "error" ? "#FF5E5E" : "#219D17" },
				]}
				className={`min-h-[50px] rounded-[10px] w-[300px] items-center justify-center p-[10px]`}>
				<AppText className="text-[15px] text-white">{alert.message}</AppText>
			</Animated.View>
		</View>
	);
}
// #FF5E5E
