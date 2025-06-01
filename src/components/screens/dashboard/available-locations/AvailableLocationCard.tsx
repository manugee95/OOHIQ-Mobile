import { AvailableLocation, Upload } from "@/src/types";
import { Image } from "expo-image";
import React, { useState } from "react";
import { View } from "react-native";
import AppText from "@/src/components/shared/AppText";
import AppButton from "@/src/components/shared/AppButton";
import { AxiosError } from "axios";
import useToast from "@/src/hooks/useToast";
import ApiInstance from "@/src/utils/api-instance";
import Loader from "@/src/components/shared/Loader";
import useCredentials from "@/src/hooks/useCredentials";
import { useQueryClient } from "@tanstack/react-query";

export default function AvailableLocationCard({
	item,
}: {
	item: AvailableLocation;
}) {
	const [isAccepting, setIsAccepting] = useState(false);
	const showAndHideToast = useToast();
	const { getCredentials } = useCredentials();
	const queryClient = useQueryClient();

	async function acceptHandler() {
		try {
			setIsAccepting(true);
			const credentials = await getCredentials();
			if (credentials) {
				await ApiInstance.put(
					`/api/accept-reaudit/${item.id}`,
					{},
					{
						headers: {
							// @ts-ignore
							"auth-token": credentials.accessToken,
						},
					}
				);
				await queryClient.refetchQueries({
					queryKey: ["available-locations"],
				});
			}
			setIsAccepting(false);
		} catch (error) {
			const err = error as AxiosError<any>;
			showAndHideToast(err.response?.data?.message ?? err.message, "error");
			setIsAccepting(false);
		}
	}

	return (
		<View className="bg-[#F0F0F0] p-[10px] rounded-[10px] mb-[10px]">
			<View className="flex-row justify-between items-center pb-[10px] border-b border-b-[#d4d4d4]">
				<View className="flex-row  items-center gap-[10px]">
					<Image
						source={item.audit.closeShotUrl}
						style={{ height: 70, width: 70, borderRadius: 5 }}
					/>
					<AppText numberOfLines={2} className="w-[50%] text-[15px]">
						{item.audit.location}
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
			<View className="flex-row items-center justify-between pt-[10px]">
				<View className="w-full">
					<AppButton onPress={acceptHandler} className="!h-[50px]">
						{!isAccepting ? (
							<AppText className="text-[15px]" weight="Medium">
								Accept
							</AppText>
						) : (
							<Loader />
						)}
					</AppButton>
				</View>
			</View>
		</View>
	);
}
