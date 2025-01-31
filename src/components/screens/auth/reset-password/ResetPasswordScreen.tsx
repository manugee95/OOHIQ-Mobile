import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Formik, FormikHelpers } from "formik";
import { Image } from "expo-image";
import AppText from "@/src/components/shared/AppText";
import AppButton from "@/src/components/shared/AppButton";
import AppInput from "@/src/components/shared/form/AppInput";
import { router } from "expo-router";
import * as Yup from "yup";
import ApiInstance from "@/src/utils/api-instance";
import { AxiosError } from "axios";
import useToast from "@/src/hooks/useToast";
import Loader from "@/src/components/shared/Loader";
import { useLocalSearchParams } from "expo-router";

const schema = Yup.object().shape({
	email: Yup.string()
		.required()
		.email("Provide a valid email address")
		.label("Email"),
	code: Yup.string().required().label("Code"),
	newPassword: Yup.string().required().label("Password"),
	confirmPassword: Yup.string().required().label("Password"),
});

export interface ResetPaswordData {
	email: string;
	code: string;
	newPassword: string;
	confirmPassword?: string;
}

export default function ResetPasswordScreen() {
	const { top } = useSafeAreaInsets();
	const params = useLocalSearchParams();
	const email = params.email as string;
	const code = params.code as string;

	const initialValues: ResetPaswordData = {
		email: email,
		code: code,
		newPassword: "",
		confirmPassword: "",
	};

	const showAndHideToast = useToast();

	const handleSubmit = async (
		values: ResetPaswordData,
		{ setSubmitting }: FormikHelpers<ResetPaswordData>
	) => {
		try {
			if (values.newPassword !== values.confirmPassword) {
				throw new Error("Passwords do not match.");
			}

			delete values.confirmPassword;

			const response = await ApiInstance.post("/reset-password", values);
			showAndHideToast(response.data.message, "success");
			router.replace(`/auth`);
		} catch (error) {
			// @ts-ignore
			const err: AxiosError = error;
			// @ts-ignore
			showAndHideToast(err.response?.data?.message ?? err.message, "error");
			setSubmitting(false);
		}
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
					Reset Password
				</AppText>
				<AppText
					weight="Regular"
					className="text-[17px] !text-[#646464] text-center mt-[5px] w-[80%]">
					Enter your new password
				</AppText>
			</View>
			<Formik
				validationSchema={schema}
				initialValues={initialValues}
				onSubmit={handleSubmit}>
				{({
					handleSubmit,
					values,
					isSubmitting,
					isValidating,
					errors,
					setFieldValue,
				}) => (
					<View className="pt-[30px] pb-[30px] gap-y-[15px] px-[10px]">
						<AppInput.ForPassword
							label="Password"
							className="!bg-white border-[#ececec]"
							placeholder="Password"
							errorMessage={errors.newPassword}
							value={values.newPassword}
							onChange={(val) => setFieldValue("newPassword", val)}
						/>
						<AppInput.ForPassword
							label="Confirm Password"
							className="!bg-white border-[#ececec]"
							placeholder="Confirm Password"
							errorMessage={errors.confirmPassword}
							value={values.confirmPassword}
							onChange={(val) => setFieldValue("confirmPassword", val)}
						/>
						<AppButton
							onPress={handleSubmit}
							disabled={!isValidating && isSubmitting}>
							{!isSubmitting && (
								<AppText className="text-[17px]" weight="Medium">
									Submit
								</AppText>
							)}
							{isSubmitting && <Loader />}
						</AppButton>
					</View>
				)}
			</Formik>
		</View>
	);
}
