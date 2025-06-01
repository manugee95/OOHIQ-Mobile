import React from "react";
import { View, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DashboardIcon from "@/src/assets/images/DashboardIcon.svg";
import AccountIcon from "@/src/assets/images/AccountIcon.svg";
import WalletIcon from "@/src/assets/images/WalletIcon.svg";
import UploadIcon from "@/src/assets/images/UploadIcon.svg";
import AppText from "./AppText";
import { usePathname } from "expo-router";

const { width } = Dimensions.get("window");

export default function TabBar({
	state,
	descriptors,
	navigation,
}: BottomTabBarProps) {
	const { bottom } = useSafeAreaInsets();

	return (
		<View
			className="border-t border-t-gray-200"
			style={[styles.tabBarContainer, { paddingBottom: bottom }]}>
			{state.routes.map((route, index) => {
				const { options } = descriptors[route.key];
				const label =
					options.tabBarLabel !== undefined
						? options.tabBarLabel
						: options.title !== undefined
						? options.title
						: route.name;

				const isFocused = state.index === index;

				const onPress = () => {
					const event = navigation.emit({
						type: "tabPress",
						target: route.key,
						canPreventDefault: true,
					});

					if (!isFocused && !event.defaultPrevented) {
						navigation.navigate(route.name, route.params);
					}
				};

				const onLongPress = () => {
					navigation.emit({
						type: "tabLongPress",
						target: route.key,
					});
				};

				return (
					<TabItem
						key={route.key}
						isFocused={isFocused}
						label={typeof label === "string" ? label : ""}
						onPress={onPress}
						onLongPress={onLongPress}
					/>
				);
			})}
		</View>
	);
}

const TabItem = ({
	onPress,
	onLongPress,
	label,
	isFocused,
}: {
	onPress: () => void;
	onLongPress: () => void;
	label: string;
	isFocused: boolean;
}) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			onLongPress={onLongPress}
			style={styles.tabBarItem}>
			<View className="items-center justify-center">
				{label === "Dashboard" && (
					<DashboardIcon fill={isFocused ? "#3DF3A9" : "#C3D7CF"} />
				)}

				{label === "Wallet" && (
					<WalletIcon fill={isFocused ? "#3DF3A9" : "#C3D7CF"} />
				)}

				{label === "Uploads" && (
					<UploadIcon fill={isFocused ? "#3DF3A9" : "#C3D7CF"} />
				)}

				{label === "Account" && (
					<AccountIcon fill={isFocused ? "#3DF3A9" : "#C3D7CF"} />
				)}
			</View>
			<AppText
				className={`text-[12px] ${
					isFocused ? "text-bgBlack" : "text-[#C3D7CF]"
				}`}
				weight={"Medium"}>
				{label}
			</AppText>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	tabBarContainer: {
		width: "100%",
		paddingTop: 13,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "white",
		// paddingHorizontal: 15,
	},

	tabBarItem: {
		width: width / 4,
		alignItems: "center",
		justifyContent: "center",
		gap: 2,
		position: "relative",
	},
});
