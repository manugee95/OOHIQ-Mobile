import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import AppText from "../AppText";
import ChevronIcon from "@/src/assets/images/ChevronIcon.svg";
import useRootStore from "@/src/hooks/stores/useRootstore";
import { useQueryClient } from "@tanstack/react-query";

export default function SelectBoardCondition({
	val = "",
	errorMessage = "",
}: {
	val?: string | number;
	errorMessage?: string;
}) {
	const { boardConditionRef } = useRootStore();
	const queryClient = useQueryClient();
	const [value, setValue] = useState("");

	useEffect(() => {
		const data = queryClient.getQueryData(["board-conditions"]);

		if (val !== "") {
			// @ts-ignore
			setValue(data?.find((d) => Number(d.id) === Number(val)).name);
		}
	}, [val]);

	return (
		<Pressable
			onPress={() => boardConditionRef?.current?.present()}
			className="w-full gap-y-[10px]">
			<AppText className="text-[16px] text-textBlack" weight="Medium">
				Board Condition
			</AppText>
			<View className="bg-white h-[50px] flex-row items-center justify-between rounded-[10px] px-[10px] border border-[#ececec]">
				{val === "" && (
					<AppText className="text-[17px] text-[#8d8d8d]">
						Select Condition
					</AppText>
				)}

				{val !== "" && <AppText className="text-[15px]">{value}</AppText>}
				<View>
					<ChevronIcon fill={"#8d8d8d"} />
				</View>
			</View>
			{errorMessage !== "" && (
				<AppText className="text-[13px] text-red-500" weight="Regular">
					{errorMessage}
				</AppText>
			)}
		</Pressable>
	);
}
