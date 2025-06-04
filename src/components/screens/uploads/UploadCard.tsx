import { Upload } from "@/src/types";
import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";
import AppText from "../../shared/AppText";
import AppButton from "../../shared/AppButton";
import { router } from "expo-router";
import useUploadsStore from "@/src/hooks/stores/useUploadsStore";

export default function UploadCard({ item }: { item: Upload }) {
	const { setAuditToEvaluate } = useUploadsStore();

	return (
		<View className="bg-[#F0F0F0] p-[10px] rounded-[10px] mb-[10px]">
			<View className="flex-row justify-between items-center">
				<View className="flex-row  items-center gap-[10px]">
					<Image
						source={item.closeShotUrl}
						style={{ height: 70, width: 70, borderRadius: 5 }}
					/>
					<AppText numberOfLines={2} className="w-[50%] text-[15px]">
						{item.location}
					</AppText>
				</View>
				<AppButton
					className={`!w-[80px] !h-[32px] ${
						item.status.toLowerCase() === "pending" ? " !bg-[#D2870F]" : ""
					} ${
						item.status.toLowerCase() === "approved" ? " !bg-[#1da71b]" : ""
					}`}>
					<AppText className="text-white">{item.status}</AppText>
				</AppButton>
			</View>
			{!item.sovScore && (
				<View className="flex-row items-center justify-between pt-[10px] mt-[10px] border-t border-t-[#d4d4d4]">
					<View className="w-full">
						<AppButton
							onPress={() => {
								setAuditToEvaluate(item);
								router.push("/uploads/evaluate");
							}}
							className="!h-[50px]">
							<AppText className="text-[15px]" weight="Medium">
								Evaluate
							</AppText>
						</AppButton>
					</View>
				</View>
			)}
		</View>
	);
}
