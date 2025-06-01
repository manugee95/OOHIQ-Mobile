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
import useUploadsStore from "@/src/hooks/stores/useUploadsStore";

export default function CompetitiveBoardTypes({
	currentValue,
	setBoardType,
}: {
	currentValue: (string | number)[];
	setBoardType: (val: number) => void;
}) {
	const { getCredentials } = useCredentials();
	const billboardTypeSheet = useRef<BottomSheetModal | null>(null);
	const { setCompetitiveBoardTypesRef, competitiveBoardTypesRef } =
		useUploadsStore();

	useEffect(() => {
		setCompetitiveBoardTypesRef(billboardTypeSheet);
	}, []);

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
		<BottomSheet
			canClose={false}
			useBackdrop
			sheetRef={competitiveBoardTypesRef}
			snapPoints={["50%"]}
			snapIndex={0}>
			<BottomSheetView className="flex-1">
				<BottomSheetFlashList
					data={isLoading ? [] : data}
					renderItem={({ item }: { item: { id: number; name: string } }) => {
						return (
							<Pressable
								onPress={() => {
									setBoardType(item.id);
									competitiveBoardTypesRef?.current?.dismiss();
								}}
								className="p-[10px] py-[20px] border-b border-b-[#ececec] flex-row items-center gap-[10px]">
								<View
									className={`w-[14px] h-[14px] rounded-full border items-center justify-center ${
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
