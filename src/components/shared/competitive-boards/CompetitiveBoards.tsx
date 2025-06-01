import React, { useEffect, useRef } from "react";
import BottomSheet from "../BottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheetFlashList, BottomSheetView } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import useCredentials from "@/src/hooks/useCredentials";
import ApiInstance from "@/src/utils/api-instance";
import { Pressable, View } from "react-native";
import AppText from "../AppText";
import useUploadsStore from "@/src/hooks/stores/useUploadsStore";

export default function CompetitiveBoards({
	currentValue,
	setNoOfCompetitiveBoards,
}: {
	currentValue: string | number;
	setNoOfCompetitiveBoards: (val: number) => void;
}) {
	const { getCredentials } = useCredentials();
	const sheetRef = useRef<BottomSheetModal | null>(null);
	const { setNoOfCompetitiveBoardsRef, noOfCompetitiveBoardsRef } =
		useUploadsStore();

	useEffect(() => {
		setNoOfCompetitiveBoardsRef(sheetRef);
	}, []);

	const { data, isLoading } = useQuery({
		queryKey: ["no-of-competitive-boards"],
		queryFn: async () => {
			const credentials = await getCredentials();
			const res = await ApiInstance.get("/api/no-of-competitive-boards", {
				// @ts-ignore
				headers: { "auth-token": credentials.accessToken },
			});
			return res.data;
		},
		retry: false,
	});

	return (
		<BottomSheet
			canClose={false}
			useBackdrop
			sheetRef={noOfCompetitiveBoardsRef}
			snapPoints={["50%"]}
			snapIndex={0}>
			<BottomSheetView className="flex-1">
				<BottomSheetFlashList
					data={isLoading ? [] : data}
					estimatedItemSize={200}
					renderItem={({ item }: { item: { id: number; name: string } }) => (
						<Pressable
							onPress={() => {
								setNoOfCompetitiveBoards(item.id);
								noOfCompetitiveBoardsRef?.current?.dismiss();
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
					)}
				/>
			</BottomSheetView>
		</BottomSheet>
	);
}
