import React, { useEffect, useRef, useState } from "react";
import { CameraView } from "expo-camera";
import { View } from "react-native";
import { Pressable } from "react-native";
import Animated from "react-native-reanimated";
import {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import AppText from "@/src/components/shared/AppText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import XIcon from "@/src/assets/images/XIcon.svg";
import { Camera, useCameraDevice } from "react-native-vision-camera";

let interval: NodeJS.Timeout;
export default function RecordingVideo({
	onRecorded,
	close,
}: {
	onRecorded: (val: string) => void;
	close: () => void;
}) {
	const ref = useRef<Camera>(null);
	const [isRecording, setIsRecording] = useState(false);
	const scale = useSharedValue(1);
	const { top } = useSafeAreaInsets();
	const [seconds, setSeconds] = useState(0);

	const device = useCameraDevice("back");

	const formatTime = (secs: number) => {
		const hrs = String(Math.floor(secs / 3600)).padStart(2, "0");
		const mins = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
		const secsFormatted = String(secs % 60).padStart(2, "0");
		return `${hrs}:${mins}:${secsFormatted}`;
	};

	useEffect(() => {
		if (isRecording) {
			interval = setInterval(() => {
				setSeconds((prev) => prev + 1);
			}, 1000);
		}

		if (!isRecording) {
			clearInterval(interval);
		}

		return () => clearInterval(interval);
	}, [isRecording]);

	const btnStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }],
		};
	});

	useEffect(() => {
		if (isRecording) {
			scale.value = withSpring(0.6);
		} else {
			scale.value = withSpring(1);
		}
	}, [isRecording]);

	const startRecording = async () => {
		if (!isRecording && ref.current) {
			setIsRecording(true);

			ref.current?.startRecording({
				onRecordingFinished: (video) => {
					const path = video.path;
					onRecorded(path);
					setIsRecording(false);
				},
				onRecordingError: () => {},
			});
		} else {
			ref.current?.stopRecording();
			setIsRecording(false);
			setSeconds(0);
		}
	};

	return (
		<>
			<Camera
				device={device!}
				ref={ref}
				video={true}
				audio={true}
				enableLocation={true}
				isActive={true}
				style={{ flex: 1 }}
			/>
			<View className="absolute h-full w-[100%] right-0 top-0 z-[999999]">
				<View style={{ paddingTop: top + 30 }}></View>
				<View className="flex-1 justify-between">
					<View className="items-center justify-center w-full relative">
						{isRecording && (
							<View className="bg-[#F42727] rounded-[5px] p-[5px]">
								<AppText className="text-white">{formatTime(seconds)}</AppText>
							</View>
						)}
						{!isRecording && (
							<Pressable
								onPress={() => {
									close();
								}}
								className="absolute right-[15px] w-[35px] h-[35px] items-center justify-center">
								<XIcon fill={"white"} />
							</Pressable>
						)}
					</View>
					<View className="items-center justify-center w-full">
						<Pressable
							onPress={startRecording}
							className="w-[73px] h-[73px] rounded-full border-white border-[1.5px] items-center justify-center">
							<Animated.View
								style={[btnStyle]}
								className="w-[50px] h-[50px] bg-[#F42727] rounded-full"></Animated.View>
						</Pressable>
					</View>
				</View>
			</View>
		</>
	);
}
