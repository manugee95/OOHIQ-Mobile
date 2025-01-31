import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppText from "@/src/components/shared/AppText";
import AppButton from "@/src/components/shared/AppButton";
import { Formik } from "formik";
import AppInput from "@/src/components/shared/form/AppInput";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default function ForgotPasswordScreen() {
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
					Forgot Password ?
				</AppText>
				<AppText
					weight="Regular"
					className="text-[17px] !text-[#646464] text-center mt-[5px] w-[80%]">
					Don’t worry! we can help you reset it, Enter your email below.
				</AppText>
			</View>

			<View className="pt-[30px] pb-[30px]">
				<ForgotPasswordForm />
			</View>
		</View>
	);
}
