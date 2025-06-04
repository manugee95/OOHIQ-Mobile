import { FlashList } from "@shopify/flash-list";
import React from "react";
import { View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import ApiInstance from "@/src/utils/api-instance";
import useCredentials from "@/src/hooks/useCredentials";
import { Redirect } from "expo-router";
import Loader from "../../shared/Loader";
import UploadCard from "./UploadCard";
import { Upload } from "@/src/types";
import NoData from "@/src/assets/images/NoData.svg";
import AppText from "@/src/components/shared/AppText";

export default function UploadsScreen() {
	const { getCredentials } = useCredentials();
	const { data, isLoading, error, refetch, isRefetching } = useQuery({
		queryKey: ["audit-uploads"],
		queryFn: async () => {
			const credentials = await getCredentials();

			const res = await ApiInstance.get("/audits", {
				headers: {
					// @ts-ignore
					"auth-token": credentials.accessToken,
				},
			});

			return res.data;
		},
	});

	//console.log(data);

	if (isLoading) {
		return <Loader />;
	}

	return (
		<View className="flex-1 bg-white px-[15px] py-[15px]">
			<FlashList
				onRefresh={async () => {
					await refetch();
				}}
				refreshing={isRefetching && !isLoading}
				data={data.audits}
				renderItem={({ item }: { item: Upload }) => <UploadCard item={item} />}
				estimatedItemSize={150}
				ListEmptyComponent={
					<View className="flex-1 bg-white p-[10px] items-center justify-center">
						<NoData width={300} height={300} />
						<AppText className="text-[15px]">You have no uploads yet.</AppText>
					</View>
				}
			/>
		</View>
	);
}
