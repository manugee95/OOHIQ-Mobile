import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Formik, FormikHelpers } from "formik";
import { Image } from "expo-image";
import AppText from "@/src/components/shared/AppText";
import { Pintyper } from "react-native-pintyper";
import AppButton from "@/src/components/shared/AppButton";
import * as Yup from "yup";
import { router, useLocalSearchParams } from "expo-router";
import Loader from "@/src/components/shared/Loader";

const { width } = Dimensions.get("window");

export default function PasswordOtpScreen() {
	const { top } = useSafeAreaInsets();
	const params = useLocalSearchParams();
	const email = params?.email as string;

	const handleSubmit = async (values: { code: string }) => {
		if (!values.code) {
			return;
		}
		router.push(`/auth/resetpassword?email=${email}&code=${values.code}`);
	};

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
					Enter Verification Code
				</AppText>
				<AppText
					weight="Regular"
					className="text-[17px] !text-[#646464] text-center mt-[5px] w-[80%]">
					We have sent a verification code to johndoe@email.com
				</AppText>
			</View>

			<View className="pt-[30px] pb-[30px]">
				<Formik initialValues={{ code: "" }} onSubmit={handleSubmit}>
					{({ handleSubmit, setFieldValue, errors, values }) => (
						<View>
							<Pintyper
								numberOfDigits={4}
								onPinEntered={async (val) => {
									await setFieldValue("code", val);
									handleSubmit();
								}}
								containerStyle={styles.otpContainer}
								inputStyle={styles.inputStyle}
								inputProps={{ placeholder: "*" }}
							/>
							<View className="px-[10px]">
								<AppButton onPress={handleSubmit}>
									<AppText className="text-[17px]" weight="Medium">
										Continue
									</AppText>
								</AppButton>
							</View>
						</View>
					)}
				</Formik>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	inputStyle: {
		height: 65,
		width: width / 4 - 15,
		borderColor: "#AAAAAA",
		borderWidth: 1.5,
		padding: 10,
		fontSize: 30,
		fontFamily: "BarlowRegular",
		borderRadius: 8,
		textAlign: "center",
		marginRight: 0,
	},

	otpContainer: {
		alignItems: "center",
		justifyContent: "space-between",
		margin: 0,
		width: "100%",
		paddingHorizontal: 10,
	},
});
