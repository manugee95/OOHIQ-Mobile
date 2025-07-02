import AppText from "@/src/components/shared/AppText";
import React, { useRef, useState } from "react";
import { View } from "react-native";
import { Pressable, TouchableOpacity } from "react-native-gesture-handler";
import {
	Camera,
	useCameraDevice,
	useCameraPermission,
} from "react-native-vision-camera";
import XIcon from "@/src/assets/images/XIcon.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TakingPhoto({
	onCaptured,
	close,
}: {
	onCaptured: (val: string) => void;
	close: () => void;
}) {
	const ref = useRef<Camera>(null);
	const device = useCameraDevice("back");
	const { top } = useSafeAreaInsets();

	const capture = async () => {
		const photo = await ref.current?.takePhoto();

		if (photo) {
			onCaptured(photo?.path);
		}
	};

	return (
		<>
			<Camera
				device={device!}
				ref={ref}
				photo={true}
				enableLocation={true}
				isActive={true}
				style={{ flex: 1 }}
			/>
			<View className="absolute h-full w-[100%] right-0 top-0 z-[999999]">
				<View style={{ paddingTop: top + 30 }}></View>
				<View className="flex-1 justify-between">
					<View className="items-center justify-center w-full relative">
						<Pressable
							onPress={() => {
								close();
							}}
							style={{
								width: 35,
								height: 35,
								alignItems: "center",
								justifyContent: "center",
								position: "absolute",
								right: 15,

								borderRadius: 100,
							}}
							className="absolute bg-[#ffffff30] right-[15px] w-[35px] h-[35px] items-center justify-center">
							<XIcon fill={"white"} />
						</Pressable>
					</View>
					<View className="items-center justify-center w-full">
						<TouchableOpacity
							onPress={capture}
							style={{
								width: 73,
								height: 73,
								borderWidth: 1.5,
								borderColor: "white",
								alignItems: "center",
								justifyContent: "center",
								borderRadius: 100,
							}}
							className="w-[73px] h-[73px] rounded-full border-white border-[1.5px] items-center justify-center">
							<View className="w-[50px] h-[50px] bg-[#F42727] rounded-full"></View>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</>
	);
}
