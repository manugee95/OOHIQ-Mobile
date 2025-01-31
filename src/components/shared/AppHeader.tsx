import React from "react";
import AppText from "@/src/components/shared/AppText";
import { View, StyleSheet } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackArrow from "@/src/assets/images/BackArrow.svg";
import { Href, router } from "expo-router";

type MyTripsHeaderProps = {
	showBack?: boolean;
	rightComponent?: () => React.ReactNode;
	title?: string;
	bgColor?: string;
	backLink?: Href;
	backIconFill?: string;
	textColor?: string;
	borderBottomColor?: string;
};
export default function AppHeader({
	showBack = false,
	rightComponent,
	title,
	bgColor,
	backLink = "/dashboard",
	backIconFill = "black",
	textColor = "black",
	borderBottomColor = "#d1d1d1",
}: MyTripsHeaderProps) {
	const { top } = useSafeAreaInsets();

	return (
		<>
			<View
				className="bg-white"
				style={{
					paddingTop: top,
					backgroundColor: bgColor,
				}}></View>
			<View
				style={{ backgroundColor: bgColor, borderBottomColor }}
				className="flex-row items-center justify-center py-[15px] px-[10px] w-full bg-white border-b border-b-gray-200 relative">
				{showBack && (
					<Pressable
						onPress={() => {
							if (router.canGoBack()) {
								router.back();
							} else {
								router.replace(backLink);
							}
						}}
						style={styles.btn}>
						<BackArrow fill={backIconFill} />
					</Pressable>
				)}
				<AppText
					style={{ color: textColor }}
					weight="Bold"
					className="text-[20px] text-center">
					{title}
				</AppText>
				{rightComponent && (
					<View className="absolute right-[10px] top-[15px] h-full rounded-xl items-center justify-center">
						{rightComponent()}
					</View>
				)}
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	btn: {
		position: "absolute",
		left: 10,
		top: 15,
		width: 35,
		height: 35,
		borderRadius: 15,
		alignItems: "center",
		justifyContent: "center",
	},
});
