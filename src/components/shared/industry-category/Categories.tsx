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
import Loader from "../Loader";

export default function Categories({
	currentValue,
	setCategory,
	industryId,
}: {
	currentValue: string | number;
	setCategory: (val: number) => void;
	industryId?: string | number;
}) {
	const { getCredentials } = useCredentials();
	const categorySheet = useRef<BottomSheetModal | null>(null);
	const { setCategoryRef, categoryRef } = useRootStore();

	useEffect(() => {
		setCategoryRef(categorySheet);
	}, []);

	const { data, isLoading, error, isFetching } = useQuery({
		queryKey: ["industry-categories", industryId],
		queryFn: async () => {
			const credentials = await getCredentials();
			const response = await ApiInstance.get(
				"/categories/industry/" + industryId,
				{
					headers: {
						// @ts-ignore
						"auth-token": credentials.accessToken,
					},
				}
			);

			return response.data;
		},
		retry: false,
		enabled: industryId !== undefined && industryId !== "",
	});

	return (
		<BottomSheet
			canClose
			useBackdrop
			sheetRef={categoryRef}
			snapPoints={["30%", "50%"]}
			snapIndex={1}>
			<BottomSheetView className="flex-1">
				{isLoading || isFetching ? (
					<Loader />
				) : (
					<BottomSheetFlashList
						data={isLoading ? [] : data}
						renderItem={({ item }: { item: { id: number; name: string } }) => {
							return (
								<Pressable
									onPress={() => {
										setCategory(item.id);
										categoryRef?.current?.dismiss();
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
				)}
			</BottomSheetView>
		</BottomSheet>
	);
}
