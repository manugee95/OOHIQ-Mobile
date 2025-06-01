import AppButton from "@/src/components/shared/AppButton";
import AppText from "@/src/components/shared/AppText";
import Avatar from "@/src/components/shared/Avatar";
import CircularProgress from "@/src/components/shared/CircularProgress";
import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ArrowIcon from "@/src/assets/images/ArrowIcon.svg";
import PlusIcon from "@/src/assets/images/PlusIcon.svg";
import { router } from "expo-router";
import useRootStore from "@/src/hooks/stores/useRootstore";
import { shadowStyles } from "@/src/utils/stylesheets";
import { levels } from "@/src/utils/level-icon";
import { Redirect } from "expo-router";
import { UserLevel } from "@/src/types";
import { RefreshControl } from "react-native";
import ApiInstance from "@/src/utils/api-instance";
import useCredentials from "@/src/hooks/useCredentials";
import useToast from "@/src/hooks/useToast";
import { AxiosError } from "axios";

export default function DashboardScreen() {
	const { top } = useSafeAreaInsets();
	const { userDetails, setUserDetails } = useRootStore();
	const [nextLevel, setNextLevel] = useState<UserLevel | undefined>();
	const [isRefreshing, setIsRefreshing] = useState(false);
	const { getCredentials } = useCredentials();
	const showAndHideToast = useToast();

	if (!userDetails) {
		return <Redirect href={"/auth"} />;
	}

	const LevelIcon = levels[userDetails?.level];

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

	const username = userDetails?.fullName.split(" ");
	let nameToUse = ``;

	if (username && username[1]) {
		nameToUse += username[0];
	} else {
		if (userDetails) {
			nameToUse = userDetails?.fullName;
		}
	}

	function getNextLevel(currentLevel: UserLevel) {
		const levels: UserLevel[] = [
			"Rookie",
			"Challenger",
			"Contender",
			"Professional",
			"Ultimate",
		];

		const levelIndex = levels.indexOf(currentLevel);

		if (levelIndex !== -1) {
			if (levelIndex !== levels.length - 1) {
				setNextLevel(levels[levelIndex + 1]);
			} else {
				setNextLevel(undefined);
			}
		}
	}

	useEffect(() => {
		if (userDetails) {
			getNextLevel(userDetails?.level);
		}
	}, [userDetails]);

	return (
		<View className="flex-1 bg-white relative">
			<ScrollView
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={async () => {
							try {
								setIsRefreshing(true);
								const credentials = await getCredentials();
								const response = await ApiInstance.get("/user/detail", {
									headers: {
										// @ts-ignore
										"auth-token": credentials?.accessToken,
									},
								});
								setUserDetails(response.data);
								setIsRefreshing(false);
							} catch (error) {
								const err = error as AxiosError<any>;
								showAndHideToast(
									err.response?.data?.message ?? err.message,
									"error"
								);
							}
						}}
					/>
				}>
				<View className="bg-bgBlack" style={{ height: top + 30 }}></View>
				<View className="bg-bgBlack h-max  shrink-0 pb-[25px] relative">
					<View className="px-[10px] flex-row items-center justify-between">
						<AppText
							className="text-white text-[25px] w-[190px]"
							weight="SemiBold">
							{getGreeting()}, {nameToUse}{" "}
							{username[1] ? username[1].charAt(0).toUpperCase() + "." : ""}
						</AppText>
						<View className="relative items-center">
							<Avatar
								style={{ borderColor: "#3DF3A9", borderWidth: 1 }}
								src={userDetails?.profilePicture!}
							/>
							{LevelIcon && (
								<View className="absolute bottom-[-10px]">
									<LevelIcon />
								</View>
							)}
						</View>
					</View>
					<View className="mt-[40px] gap-y-[15px]">
						<CircularProgress
							radius={90}
							percentage={(userDetails.auditCount / userDetails.task) * 100}
							strokeWidth={15}
							color="#3DF3A9"
						/>
						<View className="items-center justify-center">
							<AppText className="text-[18px] text-white text-center">
								{userDetails?.auditCount}/{userDetails?.task} Task completed
								this month.
							</AppText>
						</View>
					</View>
				</View>
				<View className="shrink-0 py-[20px] px-[10px] gap-y-[15px]">
					{nextLevel && (
						<AppText className="text-[15px] text-center">
							You're {userDetails?.task - userDetails.auditCount} approvals away
							from being a {nextLevel}{" "}
							{nextLevel === "Challenger"
								? "🌀"
								: nextLevel === "Contender"
								? "🏆"
								: nextLevel === "Professional"
								? "💼"
								: nextLevel === "Ultimate"
								? "👑"
								: ""}
						</AppText>
					)}
					<AppButton
						onPress={() => {
							router.push("/dashboard/available-locations");
						}}
						className="!bg-[#ececec] !justify-between flex-row !px-[10px]">
						<AppText className="text-[17px]">
							Available locations for audit
						</AppText>
						<ArrowIcon fill={"black"} />
					</AppButton>
					<AppButton
						onPress={() => {
							router.push("/dashboard/pending-audits");
						}}
						className="!bg-[#ececec] !justify-between flex-row !px-[10px]">
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
				<PlusIcon fill={"#00100A"} />
				<AppText className="text-[17px]">New Audit</AppText>
			</AppButton>
		</View>
	);
}
