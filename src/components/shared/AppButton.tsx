import React, { PropsWithChildren } from "react";
import { Pressable, PressableProps } from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

type Props = {
	isLoading?: boolean;
	onPress?: () => void;
	className?: string;
	disabled?: boolean;
	style?: any;
} & PropsWithChildren;

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function AppButton({
	children,
	onPress,
	className,
	disabled,
	style,
}: Props) {
	const pressed = useSharedValue<boolean>(false);
	const animatedStyles = useAnimatedStyle(() => ({
		transform: [{ scale: withTiming(pressed.value ? 0.8 : 1) }],
	}));
	const tap = Gesture.Tap()
		.onBegin(() => {
			pressed.value = true;
		})
		.onFinalize(() => {
			pressed.value = false;
		});

	return (
		<GestureDetector gesture={tap}>
			<AnimatedPressable
				disabled={disabled}
				onPress={onPress}
				style={[animatedStyles, style]}
				className={`rounded-[10px] h-[65px] bg-primary w-full flex-row  items-center justify-center ${className}`}>
				{children}
			</AnimatedPressable>
		</GestureDetector>
	);
}
