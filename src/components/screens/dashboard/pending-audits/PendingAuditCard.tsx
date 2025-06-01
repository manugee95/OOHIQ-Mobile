import { AvailableLocation } from "@/src/types";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import AppText from "@/src/components/shared/AppText";
import AppButton from "@/src/components/shared/AppButton";
import { router } from "expo-router";
import useUploadsStore from "@/src/hooks/stores/useUploadsStore";

export default function PendingAuditCard({
	item,
}: {
	item: AvailableLocation;
}) {
	const { setAuditToReupload } = useUploadsStore();
	const [timeLeft, setTimeLeft] = useState(0);

	useEffect(() => {
		const expiryTimestamp = new Date(item.expiresAt ?? "").getTime();
		const updateCountdown = () => {
			const now = new Date().getTime();
			const remaining = Math.max(0, expiryTimestamp - now);
			setTimeLeft(remaining);
		};

		updateCountdown(); // set immediately
		const interval = setInterval(() => {
			updateCountdown();
		}, 1000);

		return () => clearInterval(interval);
	}, [item.expiresAt]);

	const hours = String(Math.floor(timeLeft / (1000 * 60 * 60))).padStart(
		2,
		"0"
	);
	const minutes = String(
		Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
	).padStart(2, "0");
	const seconds = String(Math.floor((timeLeft % (1000 * 60)) / 1000)).padStart(
		2,
		"0"
	);

	return (
		<View className="bg-[#F0F0F0] p-[10px] rounded-[10px] mb-[10px]">
			<View className="flex-row justify-between items-center pb-[10px] border-b border-b-[#d4d4d4]">
				<View className="flex-row items-center gap-[10px]">
					<Image
						source={item.audit.closeShotUrl}
						style={{ height: 70, width: 70, borderRadius: 5 }}
					/>
					<AppText numberOfLines={2} className="w-[80%] text-[15px]">
						{item.audit.location}
					</AppText>
				</View>
				{/* <AppButton
					style={{ width: "auto" }}
					className={`!h-[32px] px-[5px] shrink-0 ${
						item.status.toLowerCase() === "pending" ? " !bg-[#D2870F]" : ""
					} ${
						item.status.toLowerCase() === "approved" ? " !bg-[#1da71b]" : ""
					} ${
						item.status.toLowerCase() === "in_progress" ? " !bg-[#1da71b]" : ""
					}`}>
					<AppText className="text-white">{item.status}</AppText>
				</AppButton> */}
			</View>
			<View className="flex-row items-center justify-center gap-3 my-3">
				<AppText className="text-[#787878] text-[15px]">
					Time left to complete
				</AppText>
			</View>
			{/* Countdown Timer */}
			<View className="flex-row items-center justify-center gap-5">
				<View className="items-center">
					<AppText className="text-[24px]" weight="Bold">
						{hours}
					</AppText>
					<AppText>Hours</AppText>
				</View>
				<View className="items-center">
					<AppText className="text-[24px]" weight="Bold">
						{minutes}
					</AppText>
					<AppText>Minutes</AppText>
				</View>
				<View className="items-center">
					<AppText className="text-[24px]" weight="Bold">
						{seconds}
					</AppText>
					<AppText>Seconds</AppText>
				</View>
			</View>

			<View className="flex-row items-center justify-between pt-[10px]">
				<View className="w-full">
					<AppButton
						onPress={() => {
							setAuditToReupload(item);
							router.push(`/dashboard/upload-reaudit?auditId=${item.id}`);
						}}
						className="!h-[50px]">
						<AppText className="text-[15px]" weight="Medium">
							Upload Reaudit
						</AppText>
					</AppButton>
				</View>
			</View>
		</View>
	);
}
