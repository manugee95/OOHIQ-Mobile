import React from "react";
import { View } from "react-native";
import Success from "@/src/assets/images/SuccessImage.svg";
import AppButton from "@/src/components/shared/AppButton";
import AppText from "@/src/components/shared/AppText";
import { router } from "expo-router";

export default function AuditSubmitted({
	uploadAnother,
}: {
	uploadAnother: () => void;
}) {
	return (
		<View className="h-[400px] items-center justify-center px-[10px]">
			<Success />
			<AppText weight="SemiBold" className="text-[17px] mt-[10px]">
				Upload Successful!
			</AppText>
			<AppText className="text-[15px] text-[#777777] text-center mt-[5px]">
				Your billboard audit has been uploaded successfully. You’ve earned
				rewards for your submission. Thank you for contributing!
			</AppText>

			<AppButton
				onPress={() => router.replace("/dashboard")}
				className="mt-[20px]">
				<AppText className="text-[15px]">Go to dashboard</AppText>
			</AppButton>
			<AppButton
				onPress={uploadAnother}
				className="mt-[20px] !bg-white border border-bgBlack">
				<AppText className="text-[15px]">Upload Another Audit</AppText>
			</AppButton>
		</View>
	);
}
