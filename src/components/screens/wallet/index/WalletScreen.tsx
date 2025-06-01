import AppText from "@/src/components/shared/AppText";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Eye from "@/src/assets/images/Eye.svg";
import EyeX from "@/src/assets/images/EyeX.svg";
import CalendarIcon from "@/src/assets/images/CalendarIcon.svg";
import ChevronIcon from "@/src/assets/images/ChevronIcon.svg";
import InArrow from "@/src/assets/images/InArrow.svg";
import OutArrow from "@/src/assets/images/OutArrow.svg";
import AppButton from "@/src/components/shared/AppButton";
import { FlashList } from "@shopify/flash-list";
import { NAIRA_TEXT } from "@/src/utils/constants";
import useRootStore from "@/src/hooks/stores/useRootstore";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function WalletScreen() {
	const { top } = useSafeAreaInsets();
	const { userDetails } = useRootStore();
	const [showBalance, setShowBalance] = useState(false);

	return (
		<View className="flex-1 bg-white">
			<View className="bg-bgBlack" style={{ height: top + 30 }}></View>
			<View className="bg-bgBlack h-[30%] gap-[5px] px-[15px]">
				<TouchableOpacity
					onPress={() => {
						setShowBalance(!showBalance);
					}}>
					<Pressable className="flex-row items-center gap-3 w-full">
						<AppText
							className="text-[17px] text-white leading-[100%]"
							weight="SemiBold">
							Your Balance
						</AppText>
						{!showBalance ? <Eye fill={"white"} /> : <EyeX fill={"white"} />}
					</Pressable>
				</TouchableOpacity>
				<View className="gap-[15px]">
					<View className="flex-row items-center">
						{showBalance ? (
							<AppText className="text-[45px] text-white" weight="Bold">
								{NAIRA_TEXT}
								{userDetails?.walletBalance.toLocaleString()}
							</AppText>
						) : (
							<AppText className="text-[45px] text-white" weight="Bold">
								******
							</AppText>
						)}
					</View>
					<View className="flex-row items-center">
						<AppButton className="!w-[150px]">
							<AppText className="text-[17px]" weight="Medium">
								Withdraw
							</AppText>
						</AppButton>
					</View>
				</View>
			</View>
			<View className="grow  py-[15px]">
				<FlashList
					estimatedItemSize={150}
					ListHeaderComponent={() => (
						<View className="px-[15px] flex-row items-center justify-between mb-[15px]">
							<AppText className="text-[20px]" weight="SemiBold">
								Activities
							</AppText>
							<Pressable className="flex flex-row items-center gap-[5px]">
								<CalendarIcon />
								<AppText className="text-[17px]" weight="Medium">
									This Week
								</AppText>
								<ChevronIcon fill={"black"} />
							</Pressable>
						</View>
					)}
					data={[1, 2, 3, 4]}
					renderItem={({ item }) => (
						<Pressable className="px-[15px] border-b border-b-[#d9d9d9] py-[15px] flex-row items-center justify-between">
							<View className="flex-row gap-[6px]">
								<View className="w-[40px] h-[40px] rounded-full bg-[#11B402] items-center justify-center">
									<InArrow />
								</View>
								<View>
									<AppText className=" text-[15px]" weight="Medium">
										Audit In Bariga
									</AppText>
									<AppText
										className=" text-[15px] !text-[#8d8d8d]"
										weight="Medium">
										12, AKJ Road, Lagos
									</AppText>
								</View>
							</View>
							<AppText
								className="!text-[#11B402] text-[15px]"
								weight="SemiBold">
								+3000
							</AppText>
						</Pressable>
					)}
				/>
			</View>
		</View>
	);
}
