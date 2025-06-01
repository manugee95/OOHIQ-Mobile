import React, { useCallback, useState } from "react";
import { View } from "react-native";
import ApiInstance from "@/src/utils/api-instance";
import { useQuery } from "@tanstack/react-query";
import useToast from "@/src/hooks/useToast";
import useCredentials from "@/src/hooks/useCredentials";
import Loader from "@/src/components/shared/Loader";
import { FlashList } from "@shopify/flash-list";
import PendingAuditCard from "./PendingAuditCard";
import { AvailableLocation } from "@/src/types";
import NoData from "@/src/assets/images/NoData.svg";
import AppText from "@/src/components/shared/AppText";

export default function PendingAuditsScreen() {
	const { getCredentials } = useCredentials();

	const { data, isLoading, error, refetch, isRefetching } = useQuery({
		queryKey: ["pending-audits"],
		queryFn: async () => {
			const credentials = await getCredentials();

			const res = await ApiInstance.get(`/api/get-accepted-reaudits`, {
				headers: {
					// @ts-ignore
					"auth-token": credentials.accessToken,
				},
			});

			return res.data;
		},
	});

	console.log(data, error);

	if (isLoading) {
		return <Loader />;
	}

	// @ts-ignore
	if (error) {
		return (
			<View className="flex-1 bg-white p-[10px] items-center justify-center">
				<NoData width={300} height={300} />
				<AppText className="text-[15px]">
					{/* @ts-ignore */}
					{error.response.data.message ?? "An error occurred"}
				</AppText>
			</View>
		);
	}

	return (
		<View className="flex-1 bg-white p-[10px]">
			<FlashList
				onRefresh={async () => {
					await refetch();
				}}
				refreshing={isRefetching && !isLoading}
				data={[data?.data]}
				renderItem={({ item }: { item: AvailableLocation }) => (
					<PendingAuditCard item={item} />
				)}
				estimatedItemSize={150}
			/>
		</View>
	);
}
