import React from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Avatar from "@/src/components/shared/Avatar";
import AppText from "@/src/components/shared/AppText";
import BronzeMedal from "@/src/assets/images/BronzeMedal.svg";
import NairaIcon from "@/src/assets/images/NairaIcon.svg";
import PasswordSecurity from "@/src/assets/images/PasswordSecurity.svg";
import LogoutIcon from "@/src/assets/images/LogoutIcon.svg";
import AppButton from "@/src/components/shared/AppButton";
import ChevronIcon from "@/src/assets/images/ChevronIcon.svg";
import { FlashList } from "@shopify/flash-list";
import * as SecureStore from "expo-secure-store";
import useRootStore from "@/src/hooks/stores/useRootstore";
import { router } from "expo-router";

export default function AccountScreen() {
	const { top } = useSafeAreaInsets();
	const { setIsAuthenticated } = useRootStore();
	const { userDetails } = useRootStore();

	function logout() {
		SecureStore.deleteItemAsync("credentials");
		setIsAuthenticated(false);
		router.replace("/auth");
	}

	return (
		<View className="flex-1 bg-white">
			<View className="bg-bgBlack" style={{ height: top + 30 }}></View>
			<View className="h-[30%] bg-bgBlack items-center">
				<Avatar size={70} src={userDetails?.profilePicture!} />
				<AppText className="!text-white text-[20px]" weight="SemiBold">
					{userDetails?.fullName}
				</AppText>
				<View className="flex-row items-center">
					<AppText className="!text-white text-[15px]">Rookie</AppText>
					<BronzeMedal />
				</View>
				<AppButton className="rounded-full !w-[40%] !h-[50px] mt-[10px]">
					<AppText className="!text-bgBlack text-[15px]" weight="Medium">
						View Profile
					</AppText>
				</AppButton>
			</View>
			<View className="grow py-[15px]">
				<FlashList
					estimatedItemSize={200}
					data={[
						<Pressable className="px-[15px] border-b border-b-[#d9d9d9] py-[20px] flex-row items-center justify-between">
							<View className="flex-row gap-[6px]">
								<NairaIcon />
								<View>
									<AppText className=" text-[15px]" weight="Medium">
										Bank Accounts
									</AppText>
								</View>
							</View>
							<View className="rotate-[-90deg]">
								<ChevronIcon fill={"black"} />
							</View>
						</Pressable>,
						<Pressable className="px-[15px] border-b border-b-[#d9d9d9] py-[20px] flex-row items-center justify-between">
							<View className="flex-row gap-[6px]">
								<PasswordSecurity />
								<View>
									<AppText className=" text-[15px]" weight="Medium">
										Password & Security
									</AppText>
								</View>
							</View>
							<View className="rotate-[-90deg]">
								<ChevronIcon fill={"black"} />
							</View>
						</Pressable>,
						<Pressable
							onPress={logout}
							className="px-[15px] border-b border-b-[#d9d9d9] py-[20px] flex-row items-center justify-between">
							<View className="flex-row gap-[6px]">
								<LogoutIcon />
								<View>
									<AppText
										className=" text-[15px] !text-[#FF5E5E]"
										weight="Medium">
										Logout
									</AppText>
								</View>
							</View>
							<View className="rotate-[-90deg]">
								<ChevronIcon fill={"black"} />
							</View>
						</Pressable>,
					]}
					renderItem={({ item }) => item}
				/>
			</View>
		</View>
	);
}
