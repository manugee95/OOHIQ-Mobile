import React, { useEffect } from "react";
import BottomSheet from "../BottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { Pressable, View } from "react-native";
import { BottomSheetFlashList, BottomSheetView } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import ApiInstance from "@/src/utils/api-instance";
import useCredentials from "@/src/hooks/useCredentials";
import AppText from "../AppText";
import useRootStore from "@/src/hooks/stores/useRootstore";

export default function Advertisers({
	currentValue,
	setAdvertiser,
}: {
	currentValue: string | number;
	setAdvertiser: (val: number) => void;
}) {
	const { getCredentials } = useCredentials();
	const advertiserSheet = useRef<BottomSheetModal | null>(null);
	const { setAdvertiserRef, advertiserRef } = useRootStore();

	useEffect(() => {
		setAdvertiserRef(advertiserSheet);
	}, []);

	const { data, isLoading, error } = useQuery({
		queryKey: ["advertisers"],
		queryFn: async () => {
			const credentials = await getCredentials();
			const response = await ApiInstance.get("/advertisers", {
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
		<BottomSheet
			canClose
			useBackdrop
			sheetRef={advertiserRef}
			snapPoints={["30%", "50%"]}
			snapIndex={1}>
			<BottomSheetView className="flex-1">
				<BottomSheetFlashList
					data={isLoading ? [] : data}
					renderItem={({ item }: { item: { id: number; name: string } }) => {
						return (
							<Pressable
								onPress={() => {
									setAdvertiser(item.id);
									advertiserRef?.current?.dismiss();
								}}
								className="p-[10px] py-[20px] border-b border-b-[#ececec] flex-row items-center gap-[10px]">
								<View
									className={`w-[14px] h-[14px] rounded-full border items-center justify-center shrink-0 ${
										Number(item.id) === Number(currentValue)
											? "border-bgBlack"
											: "border-[#ececec]"
									}`}>
									<View
										className={`w-[8px] h-[8px] rounded-full ${
											Number(item.id) === Number(currentValue)
												? "bg-bgBlack"
												: "bg-transparent"
										}`}></View>
								</View>
								<AppText className="text-[17px] shrink-0 grow max-w-[90%]">
									{item.name}
								</AppText>
							</Pressable>
						);
					}}
					estimatedItemSize={200}
				/>
			</BottomSheetView>
		</BottomSheet>
	);
}
