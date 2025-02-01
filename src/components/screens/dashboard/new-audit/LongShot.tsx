import React from "react";
import ImageIcon from "@/src/assets/images/ImageIcon.svg";
import CameraIcon from "@/src/assets/images/CameraIcon.svg";
import { View } from "react-native";
import AppButton from "@/src/components/shared/AppButton";
import AppText from "@/src/components/shared/AppText";
import { Steps } from "./NewAuditScreen";
import { ImagePickerAsset } from "expo-image-picker";
import { Image } from "expo-image";
import ChevronIcon from "@/src/assets/images/ChevronIcon.svg";

interface LongShotProps {
	PickImage: (val: Steps) => void;
	TakeLongShot: () => void;
	onLongShot: () => void;
	currentShot: ImagePickerAsset | null;
	back?: () => void;
}
export default function LongShot({
	PickImage,
	onLongShot,
	TakeLongShot,
	currentShot,
	back,
}: LongShotProps) {
	return (
		<View className="mt-[30px] gap-y-[20px]  px-[15px]">
			<AppButton
				onPress={() => {
					if (back) {
						back();
					}
				}}
				className="!h-[40px] rounded-full !w-[100px]  !bg-[#f5f5f5] gap-[8px]">
				<View className="rotate-[90deg]">
					<ChevronIcon fill={"black"} />
				</View>
				<AppText>Go Back</AppText>
			</AppButton>
			<View className="w-full gap-y-[20px]">
				<View className="gap-y-[5px]">
					<AppText className="text-[17px]" weight="Medium">
						Long Shot
					</AppText>
					<AppText className="text-[14px] text-[#8d8d8d]">
						Please capture a Straight-On View of the Billboard. The camera
						should face the billboard directly, and the edges should appear
						straight and symmetrical.
					</AppText>
				</View>
				<View className="flex-row items-center gap-[10px]">
					<AppButton
						onPress={() => PickImage("long-shot")}
						className="!w-1/2 !bg-transparent border border-[#ececec] gap-[10px]">
						<ImageIcon />
						<AppText className="text-[17px] text-[#8d8d8d]">
							Select Image
						</AppText>
					</AppButton>
					<AppButton
						onPress={TakeLongShot}
						className="!w-1/2 !bg-transparent border border-[#ececec] gap-[10px]">
						<CameraIcon />
						<AppText className="text-[17px] text-[#8d8d8d]">Take Photo</AppText>
					</AppButton>
				</View>
				{currentShot && (
					<View className="rounded-[10px] overflow-hidden">
						<Image
							source={currentShot?.uri}
							style={{ width: "100%", height: 180 }}
						/>
					</View>
				)}
			</View>
			<AppButton
				onPress={async () => {
					onLongShot();
				}}>
				<AppText className="text-[17px]" weight="Medium">
					Continue
				</AppText>
			</AppButton>
		</View>
	);
}
