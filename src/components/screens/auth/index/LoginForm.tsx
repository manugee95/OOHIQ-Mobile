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
import useRootStore from "@/src/hooks/stores/useRootstore";

const schema = Yup.object().shape({
	email: Yup.string()
		.required()
		.email("Provide a valid email address")
		.label("Email"),
	password: Yup.string().required().label("Password"),
});

export interface LoginData {
	email: string;
	password: string;
}

export default function LoginForm() {
	const initialValues: LoginData = {
		email: "",
		password: "",
	};

	const showAndHideToast = useToast();
	const { setIsAuthenticated, setUserDetails } = useRootStore();

	const handleSubmit = async (
		values: LoginData,
		{ setSubmitting }: FormikHelpers<LoginData>
	) => {
		try {
			const response = await ApiInstance.post("/login", values);

			await SecureStore.setItemAsync(
				"credentials",
				JSON.stringify({
					accessToken: response.data.token,
				})
			);

			await SecureStore.setItemAsync(
				"googleApiKey",
				response.data.google_api_key
			);

			const response2 = await ApiInstance.get("/user/detail", {
				headers: {
					// @ts-ignore
					"auth-token": response.data.token,
				},
			});

			setUserDetails(response2.data);
			setIsAuthenticated(true);

			showAndHideToast(response.data.message, "success");
			router.replace("/dashboard");
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
			initialValues={initialValues}
			onSubmit={handleSubmit}
			validationSchema={schema}>
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
						className="!bg-white"
						placeholder="Email Address"
						errorMessage={errors.email}
						value={values.email}
						onChange={(val) => setFieldValue("email", val)}
					/>

					<View className="gap-y-[8px] w-full">
						<AppInput.ForPassword
							label="Password"
							className="!bg-white"
							placeholder="Password"
							errorMessage={errors.password}
							value={values.password}
							onChange={(val) => setFieldValue("password", val)}
						/>
						<View className="w-full">
							<Pressable onPress={() => router.push("/auth/forgotpassword")}>
								<AppText className="w-max text-[17px] text-right">
									Forgot Password ?
								</AppText>
							</Pressable>
						</View>
					</View>
					<AppButton
						onPress={handleSubmit}
						disabled={!isValidating && isSubmitting}>
						{!isSubmitting && (
							<AppText className="text-[17px]" weight="Medium">
								Sign In
							</AppText>
						)}
						{isSubmitting && <Loader />}
					</AppButton>
					<AppText className="text-center text-[17px]">
						Don’t have an account ? Sign Up
					</AppText>
				</View>
			)}
		</Formik>
	);
}
