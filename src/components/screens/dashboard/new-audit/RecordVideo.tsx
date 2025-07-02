import React from "react";
import { View } from "react-native";
import AppText from "@/src/components/shared/AppText";
import AppButton from "@/src/components/shared/AppButton";
import { useVideoPlayer, VideoView } from "expo-video";
import { ScrollView } from "react-native-gesture-handler";
import ChevronIcon from "@/src/assets/images/ChevronIcon.svg";

interface RecordVideoProps {
	startRecording: () => void;
	videoSource: string | null;
	back?: () => void;
}

export default function RecordVideo({
	startRecording,
	videoSource,
	back,
}: RecordVideoProps) {
	const player = useVideoPlayer(videoSource, (player) => {
		player.play();
	});

	return (
		<ScrollView>
			<View className="mt-[30px] gap-y-[20px]  px-[15px] pb-[20px]">
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
							Video Recording
						</AppText>
						<AppText className="text-[14px] text-[#8d8d8d]">
							Please record the board surrounding.
						</AppText>
					</View>
				</View>
				{videoSource && (
					<VideoView
						style={{ width: "100%", height: 500 }}
						contentFit="cover"
						player={player}
						allowsFullscreen
						allowsPictureInPicture
					/>
				)}
				<AppButton
					onPress={async () => {
						player.pause();
						startRecording();
					}}
					className={`${!videoSource ? "" : "!bg-[#f5f5f5]"}`}>
					<AppText className="text-[17px]" weight="Medium">
						{!videoSource ? "Start Recording" : "Record Again"}
					</AppText>
				</AppButton>
			</View>
		</ScrollView>
	);
}
