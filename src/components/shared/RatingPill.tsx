import React from "react";
import { View } from "react-native";
import StarIcon from "@/src/assets/images/StarIcon.svg";
import AppText from "./AppText";
import { shadowStyles } from "@/src/utils/stylesheets";

export default function RatingPill({
	bgColor = "#000000B2",
	textColor = "white",
	useShadow = false,
}: {
	bgColor?: string;
	textColor?: string;
	useShadow?: boolean;
}) {
	return (
		<View
			style={[
				{ backgroundColor: bgColor },
				useShadow ? shadowStyles.shadow : {},
			]}
			className="flex-row items-center justify-center gap-x-[5px] rounded-full w-full h-[25px]">
			<StarIcon width={15} fill={"#FC9B09"} />
			<AppText style={{ color: textColor }} className="text-[13px]">
				4.7
			</AppText>
		</View>
	);
}
