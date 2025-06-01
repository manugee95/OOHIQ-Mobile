import { Stack } from "expo-router";
import React, { useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import AppHeader from "@/src/components/shared/AppHeader";
import useRootStore from "@/src/hooks/stores/useRootstore";
import AppText from "@/src/components/shared/AppText";
import AppButton from "@/src/components/shared/AppButton";
import BronzeMedal from "@/src/assets/images/BronzeMedal.svg";
import Avatar from "@/src/components/shared/Avatar";
import { router } from "expo-router";
import ApiInstance from "@/src/utils/api-instance";
import Loader from "@/src/components/shared/Loader";
import {
	AssetInfo,
	getPermissionsAsync,
	requestPermissionsAsync,
	createAssetAsync,
	getAssetInfoAsync,
} from "expo-media-library";
import {
	launchImageLibraryAsync,
	requestMediaLibraryPermissionsAsync,
	getMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import mime from "mime";
import useToast from "@/src/hooks/useToast";
import useCredentials from "@/src/hooks/useCredentials";
import { Formik } from "formik";
import AppInput from "@/src/components/shared/form/AppInput";
import * as Yup from "yup";
import { ScrollView } from "react-native-gesture-handler";
import { Redirect } from "expo-router";
import { levels } from "@/src/utils/level-icon";

const schema = Yup.object().shape({
	email: Yup.string()
		.required()
		.email("Provide a valid email address")
		.label("Email"),
	fullName: Yup.string().required().label("Full Name"),
});

export default function ProfileScreen() {
	const { userDetails, setUserDetails } = useRootStore();
	const [file, setFile] = useState<AssetInfo | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const showAndHideToast = useToast();
	const { getCredentials } = useCredentials();

	if (!userDetails) {
		return <Redirect href={"/auth"} />;
	}

	const LevelIcon = levels[userDetails?.level];

	async function profileUploadHandler() {
		try {
			if (!file) {
				return;
			}

			setIsUploading(true);

			const data = new FormData();
			const credentials = await getCredentials();

			if (userDetails) {
				Object.keys(userDetails).forEach((k) => {
					if (k !== "profilePicture" && k !== "id") {
						// @ts-ignore
						data.append(k, userDetails[k]);
					}
				});
			}

			// @ts-ignore
			data.append("profilePicture", {
				uri: file.localUri,
				name: file.filename,
				// @ts-ignore
				type: mime.getType(file.localUri),
			});

			const res = await ApiInstance.put("/user/" + userDetails?.id, data, {
				headers: {
					"Content-Type": "multipart/form-data",
					// @ts-ignore
					"auth-token": credentials.accessToken,
				},
			});

			setUserDetails({ ...userDetails, ...res.data });

			console.log(res.data);
			showAndHideToast("Profile Picture Updated", "success");
			setIsUploading(false);
			setFile(null);
		} catch (error) {
			// @ts-ignore
			showAndHideToast(error.message, "error");

			setIsUploading(false);
			setFile(null);
		}
	}

	async function showGallery() {
		const result = await launchImageLibraryAsync({
			allowsMultipleSelection: false,
			exif: true,
			allowsEditing: false,
			mediaTypes: ["images"],
			legacy: true,
		});

		if (result.canceled) {
			return;
		} else {
			try {
				const savedAssets = await Promise.all(
					result.assets.map(async (asset) => {
						const localAsset = await createAssetAsync(asset.uri);
						const assetInfo = await getAssetInfoAsync(localAsset);
						return assetInfo;
					})
				);
				setFile(savedAssets[0]);
			} catch (error) {
				console.log(error);
			}
		}
	}

	async function PickImage() {
		getPermissionsAsync().then(async ({ granted: mediaGranted }) => {
			if (mediaGranted) {
				const { granted } = await getMediaLibraryPermissionsAsync();

				if (!granted) {
					const { granted: mediaGranted } =
						await requestMediaLibraryPermissionsAsync();
					if (mediaGranted) {
						showGallery();
					}
				} else {
					showGallery();
				}
			} else {
				requestPermissionsAsync().then(async ({ granted }) => {
					if (!granted) {
						const { granted: mediaGranted } =
							await requestMediaLibraryPermissionsAsync();
						if (mediaGranted) {
							showGallery();
						}
					} else {
						showGallery();
					}
				});
			}
		});
	}

	useEffect(() => {
		if (file) {
			profileUploadHandler();
		}
	}, [file]);

	return (
		<View className="flex-1 bg-white">
			<Stack.Screen
				options={{
					headerShown: true,
					header: () => (
						<AppHeader
							showBack
							backIconFill="white"
							bgColor="#00100A"
							title=""
							textColor="white"
							borderBottomColor="transparent"
						/>
					),
				}}
			/>
			<ScrollView>
				<View className="h-max py-[50px] bg-bgBlack items-center">
					{isUploading ? (
						<ActivityIndicator size={"large"} />
					) : (
						<Avatar size={70} src={userDetails?.profilePicture!} />
					)}
					<AppText className="!text-white text-[20px]" weight="SemiBold">
						{userDetails?.fullName}
					</AppText>
					<View className="flex-row items-center gap-[5px] mt-[7px]">
						<AppText className="!text-white text-[15px]">
							{userDetails.level}
						</AppText>
						<LevelIcon />
					</View>
					<AppButton
						onPress={() => {
							PickImage();
						}}
						disabled={isUploading}
						className="rounded-full !w-[40%] !h-[50px] mt-[10px] disabled:opacity-80">
						{isUploading ? (
							<Loader />
						) : (
							<AppText className="!text-bgBlack text-[15px]" weight="Medium">
								Change Photo
							</AppText>
						)}
					</AppButton>
				</View>
				<Formik
					initialValues={{
						fullName: userDetails.fullName,
						email: userDetails.email,
					}}
					validationSchema={schema}
					onSubmit={async (values, { setSubmitting }) => {
						try {
							const credentials = await getCredentials();

							const res = await ApiInstance.put(
								"/user/" + userDetails?.id,
								values,
								{
									headers: {
										"Content-Type": "multipart/form-data",
										// @ts-ignore
										"auth-token": credentials.accessToken,
									},
								}
							);

							setUserDetails({ ...userDetails, ...res.data });

							console.log(res.data);
							showAndHideToast("Profile Picture Updated", "success");
						} catch (error) {
							// @ts-ignore
							showAndHideToast(error.message, "error");

							setSubmitting(false);
						}
					}}>
					{({
						values,
						errors,
						setFieldValue,
						isSubmitting,
						isValidating,
						handleSubmit,
					}) => (
						<View className="p-[15px] gap-6">
							<AppInput
								placeholder="Full Name"
								label="Full Name"
								onChange={(val) => setFieldValue("fullName", val)}
								errorMessage={errors.fullName}
								value={values.fullName}
							/>
							<AppInput
								placeholder="Email"
								label="Email"
								onChange={(val) => setFieldValue("email", val)}
								errorMessage={errors.fullName}
								value={values.email}
							/>
							<View className="gap-5 mt-[20px]">
								<AppButton onPress={handleSubmit} disabled={isSubmitting}>
									{!isValidating && isSubmitting ? (
										<Loader />
									) : (
										<AppText className="text-[15px]" weight="Medium">
											Update
										</AppText>
									)}
								</AppButton>
								<AppButton className="!bg-[#FF5E5E]">
									<AppText className="text-[15px] text-white" weight="Medium">
										Delete Account
									</AppText>
								</AppButton>
							</View>
						</View>
					)}
				</Formik>
			</ScrollView>
		</View>
	);
}
