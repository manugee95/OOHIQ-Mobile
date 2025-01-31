import React from "react";
import { Formik, FormikHelpers } from "formik";
import AppButton from "@/src/components/shared/AppButton";
import AppInput from "@/src/components/shared/form/AppInput";
import AppText from "@/src/components/shared/AppText";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import * as Yup from "yup";
import ApiInstance from "@/src/utils/api-instance";
import { AxiosError } from "axios";
import useToast from "@/src/hooks/useToast";
import Loader from "@/src/components/shared/Loader";
import * as SecureStore from "expo-secure-store";

const schema = Yup.object().shape({
	email: Yup.string()
		.required()
		.email("Provide a valid email address")
		.label("Email"),
});

export interface ForgotPasswordData {
	email: string;
}

export default function ForgotPasswordForm() {
	const initialValues: ForgotPasswordData = {
		email: "",
	};

	const showAndHideToast = useToast();

	const handleSubmit = async (
		values: ForgotPasswordData,
		{ setSubmitting }: FormikHelpers<ForgotPasswordData>
	) => {
		try {
			const response = await ApiInstance.post("/forgot-password", values);
			showAndHideToast(response.data.message, "success");
			router.replace(`/auth/passwordotp?email=${values.email}`);
		} catch (error) {
			// @ts-ignore
			const err: AxiosError = error;
			// @ts-ignore
			showAndHideToast(err.response?.data?.message ?? err.message, "error");
			setSubmitting(false);
		}
	};

	return (
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
				<View className="px-[10px] gap-[15px]">
					<AppInput
						label="Email Address"
						className="!bg-white !border-[1.5px] !border-[#ECECEC]"
						placeholder="Email Address"
						errorMessage={errors.email}
						value={values.email}
						onChange={(val) => setFieldValue("email", val)}
					/>

					<AppButton
						onPress={handleSubmit}
						disabled={!isValidating && isSubmitting}>
						{!isSubmitting && (
							<AppText className="text-[17px]" weight="Medium">
								Continue
							</AppText>
						)}
						{isSubmitting && <Loader />}
					</AppButton>
					<AppButton
						onPress={() => router.back()}
						className="!bg-transparent border-[#AAAAAA] border-[1.5px]">
						<AppText className="text-[17px] text-[#979797]" weight="Medium">
							Cancel
						</AppText>
					</AppButton>
				</View>
			)}
		</Formik>
	);
}
