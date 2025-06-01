import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import AppText from "../AppText";
import PlusIcon from "@/src/assets/images/PlusIcon.svg";
import CheckmarkIcon from "@/src/assets/images/CheckmarkIcon.svg";
import useRootStore from "@/src/hooks/stores/useRootstore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useUploadsStore from "@/src/hooks/stores/useUploadsStore";
import useCredentials from "@/src/hooks/useCredentials";
import ApiInstance from "@/src/utils/api-instance";

export default function SelectCompetitiveBoardType({
	setCompetitiveBoardType,
	selectedTypes,
	errorMessage = "",
}: {
	setCompetitiveBoardType: (val: (string | number)[]) => void;
	selectedTypes: (string | number)[];
	errorMessage?: string;
}) {
	const queryClient = useQueryClient();
	const { getCredentials } = useCredentials();

	const { data, isLoading } = useQuery({
		queryKey: ["billboard-types"],
		queryFn: async () => {
			const credentials = await getCredentials();
			const response = await ApiInstance.get("/api/board-type", {
				headers: {
					// @ts-ignore
					"auth-token": credentials.accessToken,
				},
			});

			return response.data;
		},
		retry: false,
	});

	return (
		<View className="w-full gap-y-[20px]">
			<AppText className="text-[16px] text-textBlack" weight="Medium">
				Competitive Board Types
			</AppText>
			<View className="flex-row flex-wrap gap-[5px]">
				{isLoading &&
					[1, 2, 3, 4, 5].map((d, i) => (
						<View
							key={i}
							className="bg-[#f5f5f5] w-[70px] h-[40px] rounded-full"></View>
					))}

				{!isLoading &&
					data.map((d: { id: number; name: string }, i: number) => (
						<Pressable
							onPress={() => {
								if (!selectedTypes.includes(Number(d.id))) {
									setCompetitiveBoardType([...selectedTypes, Number(d.id)]);
								} else {
									setCompetitiveBoardType(
										selectedTypes.filter((v) => v !== Number(d.id))
									);
								}
							}}
							key={i}
							className={`${
								selectedTypes.includes(Number(d.id))
									? "bg-bgBlack"
									: "bg-[#f5f5f5]"
							} p-[10px] rounded-full flex-row gap-2 items-center`}>
							{selectedTypes.includes(Number(d.id)) ? (
								<>
									<AppText className="text-white">{d.name}</AppText>
									<CheckmarkIcon fill={"#3DF3A9"} />
								</>
							) : (
								<>
									<AppText>{d.name}</AppText>
									<PlusIcon fill={"#787878"} />
								</>
							)}
						</Pressable>
					))}
			</View>
		</View>
	);
}
