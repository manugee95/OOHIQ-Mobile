import AppButton from "@/src/components/shared/AppButton";
import AppText from "@/src/components/shared/AppText";
import Avatar from "@/src/components/shared/Avatar";
import CircularProgress from "@/src/components/shared/CircularProgress";
import React from "react";
import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ArrowIcon from "@/src/assets/images/ArrowIcon.svg";
import PlusIcon from "@/src/assets/images/PlusIcon.svg";
import { router } from "expo-router";
import useRootStore from "@/src/hooks/stores/useRootstore";
import { shadowStyles } from "@/src/utils/stylesheets";

export default function DashboardScreen() {
	const { top } = useSafeAreaInsets();
	const { userDetails } = useRootStore();

	const getGreeting = () => {
		const hour = new Date().getHours(); // Get the current hour (0 - 23)

		if (hour < 12) {
			return "Good Morning";
		} else if (hour < 18) {
			return "Good Afternoon";
		} else {
			return "Good Evening";
		}
	};

	return (
		<View className="flex-1 bg-white relative">
			<ScrollView>
				<View className="bg-bgBlack" style={{ height: top + 30 }}></View>
				<View className="bg-bgBlack h-[60%]  shrink-0 pb-[25px] relative">
					<View className="px-[10px] flex-row items-center justify-between">
						<AppText
							numberOfLines={1}
							className="text-white text-[20px] w-[190px]"
							weight="SemiBold">
							{getGreeting()}, {userDetails?.fullName}
						</AppText>
						<View>
							<Avatar src={userDetails?.profilePicture!} />
						</View>
					</View>
					<View className="mt-[40px] gap-y-[35px]">
						<CircularProgress
							radius={100}
							percentage={68}
							strokeWidth={20}
							color="#3DF3A9"
						/>
						<AppText className="text-[18px] text-white text-center">
							16/40 Task completed this month.
						</AppText>
					</View>
				</View>
				<View className="shrink-0 py-[20px] px-[10px] gap-y-[15px]">
					<AppButton className="!bg-[#ececec] !justify-between flex-row !px-[10px]">
						<AppText className="text-[17px]">
							Available locations for audit
						</AppText>
						<ArrowIcon fill={"black"} />
					</AppButton>
					<AppButton className="!bg-[#ececec] !justify-between flex-row !px-[10px]">
						<AppText className="text-[17px]">Pending Audits</AppText>
						<ArrowIcon fill={"black"} />
					</AppButton>
				</View>
			</ScrollView>
			<AppButton
				style={shadowStyles.shadow}
				onPress={() => {
					router.push("/(tabs)/dashboard/new-audit");
				}}
				className="!w-[150px] absolute bottom-[20px] right-[10px] !rounded-full gap-[10px]">
				<PlusIcon />
				<AppText className="text-[17px]">New Audit</AppText>
			</AppButton>
		</View>
	);
}
