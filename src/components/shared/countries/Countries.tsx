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

export default function Countries({
	currentValue,
	setCountry,
}: {
	currentValue: string;
	setCountry: (val: string) => void;
}) {
	const { getCredentials } = useCredentials();
	const billboardTypeSheet = useRef<BottomSheetModal | null>(null);
	const { setCountriesRef, countriesRef } = useRootStore();

	useEffect(() => {
		setCountriesRef(billboardTypeSheet);
	}, []);

	const { data, isLoading, error } = useQuery({
		queryKey: ["countries"],
		queryFn: async () => {
			const credentials = await getCredentials();
			const response = await ApiInstance.get("/api/get-countries", {
				headers: {
					// @ts-ignore
					// "auth-token": credentials.accessToken,
				},
			});

			return response.data;
		},
		retry: 3,
	});

	// console.log(data, error);

	return (
		<BottomSheet
			canClose={false}
			useBackdrop
			sheetRef={countriesRef}
			snapPoints={["60%"]}
			snapIndex={0}>
			<BottomSheetView className="flex-1">
				<BottomSheetFlashList
					data={isLoading ? [1, 2, 3, 4, 5] : data}
					renderItem={({ item }: { item: { id: number; name: string } }) => {
						return (
							<Pressable
								onPress={() => {
									setCountry(item.name);
									countriesRef?.current?.dismiss();
								}}
								className="p-[10px] py-[20px] border-b border-b-[#ececec] flex-row items-center gap-[10px]">
								<View
									className={`w-[14px] h-[14px] rounded-full border items-center justify-center ${
										item.name === currentValue
											? "border-bgBlack"
											: "border-[#ececec]"
									}`}>
									<View
										className={`w-[8px] h-[8px] rounded-full ${
											item.name === currentValue
												? "bg-bgBlack"
												: "bg-transparent"
										}`}></View>
								</View>
								<AppText className="text-[17px]">{item.name}</AppText>
							</Pressable>
						);
					}}
					estimatedItemSize={200}
				/>
			</BottomSheetView>
		</BottomSheet>
	);
}
