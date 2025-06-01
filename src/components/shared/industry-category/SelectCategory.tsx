import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import AppText from "../AppText";
import ChevronIcon from "@/src/assets/images/ChevronIcon.svg";
import useRootStore from "@/src/hooks/stores/useRootstore";
import { useQueryClient } from "@tanstack/react-query";

export default function SelectCategory({
	val = "",
	errorMessage = "",
	industryId = "",
}: {
	val?: string | number;
	errorMessage?: string;
	industryId?: string | number;
}) {
	const { categoryRef } = useRootStore();
	const queryClient = useQueryClient();
	const [value, setValue] = useState("");

	useEffect(() => {
		const data = queryClient.getQueryData(["industry-categories", industryId]);

		if (val !== "" && industryId !== "") {
			// @ts-ignore
			setValue(data?.find((d) => Number(d.id) === Number(val)).name);
		}
	}, [val, industryId]);

	return (
		<Pressable
			onPress={() => categoryRef?.current?.present()}
			className="w-full gap-y-[10px]">
			<AppText className="text-[16px] text-textBlack" weight="Medium">
				Category
			</AppText>
			<View className="bg-white h-[50px] flex-row items-center justify-between rounded-[10px] px-[10px] border border-[#ececec]">
				{val === "" && (
					<AppText className="text-[17px] text-[#8d8d8d]">
						Select Category
					</AppText>
				)}

				{val !== "" && (
					<AppText numberOfLines={1} className="text-[15px]">
						{value}
					</AppText>
				)}
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
