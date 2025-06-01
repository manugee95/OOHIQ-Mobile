import React from "react";
import { View } from "react-native";
import Success from "@/src/assets/images/SuccessImage.svg";
import AppButton from "@/src/components/shared/AppButton";
import AppText from "@/src/components/shared/AppText";
import { router } from "expo-router";
import useRootStore from "@/src/hooks/stores/useRootstore";

export default function AuditSubmitted({
	uploadAnother,
}: {
	uploadAnother: () => void;
}) {
	return (
		<View className="h-[400px] items-center justify-center px-[10px]">
			<Success />
			<AppText weight="SemiBold" className="text-[17px] mt-[10px]">
				Upload In Progress!
			</AppText>
			<AppText className="text-[15px] text-[#777777] text-center mt-[5px]">
				{/* Your billboard audit is being uploaded. We'll notify you when the upload
				is complete. During the upload do not close/kill the app. */}
				Your billboard audit is being uploaded. Go to the uploads tab to see the
				status of your submission.
			</AppText>
			<AppButton
				onPress={() => {
					router.replace("/dashboard");
				}}
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
