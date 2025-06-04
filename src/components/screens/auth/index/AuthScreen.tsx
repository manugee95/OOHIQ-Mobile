import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppText from "@/src/components/shared/AppText";
import AppButton from "@/src/components/shared/AppButton";
import { Formik } from "formik";
import AppInput from "@/src/components/shared/form/AppInput";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function AuthScreen() {
	const { top } = useSafeAreaInsets();
	const [currentTab, setCurrentTab] = useState<"signin" | "signup">("signin");

	return (
		<View className="flex-1 bg-white">
			<View style={{ height: top + 30 }}></View>
			<View className="items-center justify-center px-[10px]">
				<Image
					source={require("@/src/assets/images/oohiq-logo.png")}
					style={{
						width: 85,
						height: 80,
					}}
				/>
				<AppText weight="SemiBold" className="text-[30px] mt-[10px]">
					Welcome to OOHIQ
				</AppText>
				<AppText
					weight="Regular"
					className="text-[17px] !text-[#646464] text-center mt-[5px] w-[80%]">
					Sign up or Sign in below to complete tasks and get rewards.
				</AppText>
			</View>
			<View className="flex-row mt-[20px]">
				<AppButton
					onPress={() => setCurrentTab("signin")}
					className={`!w-1/2 bg-transparent  border-b-[1.5px] !rounded-none ${
						currentTab === "signin" ? "border-b-bgBlack" : "border-b-[#ececec]"
					}`}>
					<AppText
						weight="Medium"
						className={`text-[17px] ${
							currentTab === "signin" ? "!text-bgBlack" : "!text-[#6D706F]"
						}`}>
						Sign In
					</AppText>
				</AppButton>
				<AppButton
					onPress={() => setCurrentTab("signup")}
					className={`!w-1/2 bg-transparent  border-b-[1.5px] !rounded-none ${
						currentTab === "signup" ? "border-b-bgBlack" : "border-b-[#ececec]"
					}`}>
					<AppText
						weight="Medium"
						className={`text-[17px] ${
							currentTab === "signup" ? "!text-bgBlack" : "!text-[#6D706F]"
						}`}>
						Sign Up
					</AppText>
				</AppButton>
			</View>
			<View className="pt-[20px] pb-[30px] grow bg-[#F6F6F6]">
				{currentTab === "signin" ? <LoginForm /> : <SignupForm />}
			</View>
		</View>
	);
}
