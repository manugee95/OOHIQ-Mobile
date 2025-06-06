import React from "react";
import { Formik, FormikHelpers } from "formik";
import AppButton from "@/src/components/shared/AppButton";
import AppInput from "@/src/components/shared/form/AppInput";
import AppText from "@/src/components/shared/AppText";
import { Pressable, ScrollView, View } from "react-native";
import * as Yup from "yup";
import { router } from "expo-router";
import ApiInstance from "@/src/utils/api-instance";
import { AxiosError } from "axios";
import useToast from "@/src/hooks/useToast";
import Loader from "@/src/components/shared/Loader";
import * as SecureStore from "expo-secure-store";
import useRootStore from "@/src/hooks/stores/useRootstore";
import Countries from "@/src/components/shared/countries/Countries";
import SelectCountry from "@/src/components/shared/countries/SelectCountry";

const schema = Yup.object().shape({
	email: Yup.string()
		.required()
		.email("Provide a valid email address")
		.label("Email"),
	fullName: Yup.string().required().label("Full Name"),
	password: Yup.string().required().label("Password"),
	confirmPassword: Yup.string().required().label("Password"),
	role: Yup.string().required().label("Role"),
	country: Yup.string().required().label("Country"),
});

export interface SignupData {
	email: string;
	fullName: string;
	password: string;
	role: "FIELD_AUDITOR";
	confirmPassword: string;
	country: string;
}

export default function SignupForm({
	setCurrentTab,
}: {
	setCurrentTab: (val: "signin") => void;
}) {
	const initialValues: SignupData = {
		email: "",
		fullName: "",
		password: "",
		role: "FIELD_AUDITOR",
		confirmPassword: "",
		country: "",
	};

	const showAndHideToast = useToast();
	const { setIsAuthenticated, setUserDetails } = useRootStore();

	const handleSubmit = async (
		values: SignupData,
		{ setSubmitting }: FormikHelpers<SignupData>
	) => {
		try {
			if (values.password !== values.confirmPassword) {
				throw new Error("Passwords do not match");
			}

			const response = await ApiInstance.post("/signup", values);

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
			router.replace("/dashboard");
			showAndHideToast(response.data.message, "success");
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
				<>
					<ScrollView style={{ flex: 1 }}>
						<View className="px-[10px] gap-[15px]">
							<SelectCountry
								val={values.country}
								errorMessage={errors.country}
							/>
							<AppInput
								label="Full Name"
								className="!bg-white"
								placeholder="Full Name"
								errorMessage={errors.fullName}
								value={values.fullName}
								onChange={(val) => setFieldValue("fullName", val)}
							/>
							<AppInput
								label="Email Address"
								className="!bg-white"
								placeholder="Email Address"
								errorMessage={errors.email}
								value={values.email}
								onChange={(val) => setFieldValue("email", val)}
							/>
							<AppInput.ForPassword
								label="Password"
								className="!bg-white"
								placeholder="Password"
								errorMessage={errors.password}
								value={values.password}
								onChange={(val) => setFieldValue("password", val)}
							/>
							<AppInput.ForPassword
								label="Confirm Password"
								className="!bg-white"
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
										Sign Up
									</AppText>
								)}
								{isSubmitting && <Loader />}
							</AppButton>
							<Pressable
								onPress={() => {
									setCurrentTab("signin");
								}}>
								<AppText className="text-center text-[17px]">
									Already have an account ? Sign In
								</AppText>
							</Pressable>
						</View>
					</ScrollView>
					<Countries
						setCountry={(val) => {
							setFieldValue("country", val, false);
						}}
						currentValue={values.country}
					/>
				</>
			)}
		</Formik>
	);
}
