import AppHeader from "@/src/components/shared/AppHeader";
import { Stack } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { View } from "react-native";
import { useFocusEffect } from "expo-router";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import useToast from "@/src/hooks/useToast";
import useRootStore from "@/src/hooks/stores/useRootstore";
import { AxiosError } from "axios";
import ApiInstance from "@/src/utils/api-instance";
import {
	getCurrentPositionAsync,
	requestForegroundPermissionsAsync,
	getForegroundPermissionsAsync,
	LocationAccuracy,
} from "expo-location";
import {
	ImagePickerAsset,
	getMediaLibraryPermissionsAsync,
	requestMediaLibraryPermissionsAsync,
	launchImageLibraryAsync,
	launchCameraAsync,
	getCameraPermissionsAsync,
	requestCameraPermissionsAsync,
} from "expo-image-picker";
import { googleMapClient } from "@/src/utils/google-loader";
import Loader from "@/src/components/shared/Loader";
import BillboardTypes from "@/src/components/shared/billboard-type/BillboardTypes";
import AuditDetails from "./AuditDetails";
import CloseShot from "./CloseShot";
import { useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import LongShot from "./LongShot";
import RecordVideo from "./RecordVideo";
import RecordingVideo from "./RecordingVideo";
import useCredentials from "@/src/hooks/useCredentials";
import AppButton from "@/src/components/shared/AppButton";
import AppText from "@/src/components/shared/AppText";
import mime from "mime";
import * as MediaLibrary from "expo-media-library";
import { Platform } from "react-native";
import AuditSubmitted from "./AuditSubmitted";

export type Steps = "details" | "close-shot" | "long-shot" | "video";

export interface NewAuditData {
	userId: number;
	billboardTypeId: number | string;
	latitude: number | string;
	longitude: number | string;
}

const schema = Yup.object().shape({
	userId: Yup.string().required(),
	billboardTypeId: Yup.string().required().label("Billboard Type"),
	latitude: Yup.number().required().label("Location"),
	longitude: Yup.number().required().label("Location"),
});

export default function NewAuditScreen() {
	const showAndHideToast = useToast();
	const { userDetails } = useRootStore();
	const { getCredentials } = useCredentials();
	const [coordinates, setCoordinates] = useState({ longitude: 0, latitude: 0 });
	const [status, requestCameraPermission] = useCameraPermissions();
	const [micStatus, requestMicPermission] = useMicrophonePermissions();

	const [isGettingLocation, setIsGettingLocation] = useState(true);
	const [isTakingVideo, setIsTakingVideo] = useState(false);
	const [closeShot, setCloseShot] = useState<ImagePickerAsset | null>(null);
	const [longShot, setLongShot] = useState<ImagePickerAsset | null>(null);
	const [video, setVideo] = useState<string | null>(null);
	const [currentLocation, setCurrentLocation] = useState("");
	const [currentStep, setCurrentStep] = useState<{ num: number; step: Steps }>({
		num: 1,
		step: "details",
	});

	const [isSubmitted, setIsSubmitted] = useState(false);

	useFocusEffect(
		useCallback(() => {
			getForegroundPermissionsAsync().then((val) => {
				if (val.granted) {
					getCurrentLocation();
				} else {
					requestForegroundPermissionsAsync().then((val) => {
						if (val.granted) {
							getCurrentLocation();
						}
					});
				}
			});
		}, [])
	);

	function getCurrentLocation() {
		getCurrentPositionAsync({
			accuracy: LocationAccuracy.Highest,
		}).then(async ({ coords }) => {
			const response = await googleMapClient.reverseGeocode({
				params: {
					key: "AIzaSyCjVjoxu3sZvJ4yzJqidKt0chMI3TT-rws",
					latlng: {
						longitude: coords.longitude,
						latitude: coords.latitude,
					},
				},
			});

			setCurrentLocation(response.data.results[0].formatted_address);
			setCoordinates({
				latitude: coords.latitude,
				longitude: coords.longitude,
			});
			setIsGettingLocation(false);
		});
	}

	async function showGallery(type: Steps) {
		const result = await launchImageLibraryAsync({
			allowsMultipleSelection: false,
			exif: true,
		});
		if (result.canceled) {
			return;
		} else {
			if (type === "close-shot") {
				setCloseShot(result.assets[0]);
			}

			if (type === "long-shot") {
				setLongShot(result.assets[0]);
			}

			if (type === "video") {
				setVideo(result.assets[0].uri);
			}
		}
	}

	async function ShowCamera(type: Steps) {
		const result = await launchCameraAsync({
			exif: true,
		});

		if (result.canceled) {
			return;
		}

		if (type === "close-shot") {
			setCloseShot(result.assets[0]);
		}

		if (type === "long-shot") {
			setLongShot(result.assets[0]);
		}
	}

	async function PickImage(type: Steps) {
		const { granted } = await getMediaLibraryPermissionsAsync();
		if (!granted) {
			const { granted: mediaGranted } =
				await requestMediaLibraryPermissionsAsync();
			if (mediaGranted) {
				showGallery(type);
			}
		} else {
			showGallery(type);
		}
	}

	async function TakeShot(type: Steps) {
		const { granted } = await getCameraPermissionsAsync();
		if (!granted) {
			const { granted: mediaGranted } = await requestCameraPermissionsAsync();
			if (mediaGranted) {
				ShowCamera(type);
			}
		} else {
			ShowCamera(type);
		}
	}

	async function TakeVideo() {
		if (!status?.granted) {
			const { granted } = await requestCameraPermission();

			if (granted) {
				const stat = await requestMicPermission();
				if (stat.granted) {
					setIsTakingVideo(true);
				} else {
					showAndHideToast("Permission denied", "error");
				}
			} else {
				showAndHideToast("Permission denied", "error");
			}
		} else {
			if (!micStatus?.granted) {
				const stat = await requestMicPermission();
				if (stat.granted) {
					setIsTakingVideo(true);
				} else {
					showAndHideToast("Permission denied", "error");
				}
			} else {
				setIsTakingVideo(true);
			}
		}
	}

	const submitHandler = async function (
		values: NewAuditData,
		{ setSubmitting }: FormikHelpers<NewAuditData>
	) {
		try {
			const data = new FormData();
			const credentials = await getCredentials();

			data.append("userId", values.userId.toString());
			data.append("billboardTypeId", values.billboardTypeId.toString());
			data.append("latitude", values.latitude.toString());
			data.append("longitude", values.longitude.toString());

			let closeAss = await MediaLibrary.createAssetAsync(closeShot?.uri!);
			let longAss = await MediaLibrary.createAssetAsync(longShot?.uri!);
			let videoAss = await MediaLibrary.createAssetAsync(video!);

			if (Platform.OS === "ios") {
				closeAss = await MediaLibrary.getAssetInfoAsync(closeAss);
				longAss = await MediaLibrary.getAssetInfoAsync(longAss);
				videoAss = await MediaLibrary.getAssetInfoAsync(videoAss);
			}

			// @ts-ignore
			data.append("closeShot", {
				// @ts-ignore
				uri: closeAss.localUri ?? closeAss.uri,
				name: closeShot?.fileName,
				// @ts-ignore
				type: mime.getType(closeAss.localUri ?? closeAss.uri),
			});

			// @ts-ignore
			data.append("longShot", {
				// @ts-ignore
				uri: longAss.localUri ?? longAss.uri,
				name: longShot?.fileName,
				// @ts-ignore
				type: mime.getType(longAss.localUri ?? longAss.uri),
			});

			// @ts-ignore
			data.append("video", {
				// @ts-ignore
				uri: videoAss.localUri ?? videoAss.uri,
				name: "audit-vid",
				// @ts-ignore
				type: mime.getType(videoAss.localUri ?? videoAss.uri),
			});

			const response = await ApiInstance.post("/new-audit", data, {
				headers: {
					// @ts-ignore
					"auth-token": credentials.accessToken,
					"Content-Type": "multipart/form-data",
				},
			});

			showAndHideToast(response.data.message, "success");
			setIsSubmitted(true);
		} catch (error) {
			// @ts-ignore
			const err: AxiosError = error;
			// @ts-ignore
			showAndHideToast(err.response?.data?.message ?? err.message, "error");
			setSubmitting(false);
		}
	};

	const initialValues: NewAuditData = {
		userId: userDetails?.id!,
		billboardTypeId: "",
		latitude: coordinates.latitude,
		longitude: coordinates.longitude,
	};

	return (
		<View
			style={{ paddingTop: !isTakingVideo ? 20 : 0 }}
			className="w-full flex-1 bg-white">
			<Stack.Screen
				options={{
					header: () => (
						<AppHeader
							showBack
							backIconFill="white"
							bgColor="#00100A"
							title="New Audit"
							textColor="white"
						/>
					),
					headerShown: !isTakingVideo,
				}}
			/>

			{isTakingVideo && (
				<View className="absolute h-full w-[100%] right-0 top-0 z-[999999]">
					<RecordingVideo
						onRecorded={(val) => {
							setVideo(val);
							setIsTakingVideo(false);
						}}
						close={() => setIsTakingVideo(false)}
					/>
				</View>
			)}

			{isSubmitted && (
				<AuditSubmitted
					uploadAnother={() => {
						setIsSubmitted(false);
						setCloseShot(null);
						setLongShot(null);
						setVideo(null);
						setCurrentStep({ num: 1, step: "details" });
					}}
				/>
			)}

			{!isSubmitted && (
				<View className="flex-row items-center gap-[10px] px-[15px]">
					{[1, 2, 3, 4].map((d) => {
						return (
							<View
								key={d}
								className={`w-[66px] h-[4px] rounded-full ${
									currentStep.num >= d ? "bg-primary" : "bg-[#eeeeee]"
								}`}></View>
						);
					})}
				</View>
			)}

			{isGettingLocation && <Loader />}

			{!isGettingLocation && !isSubmitted && (
				<Formik
					onSubmit={submitHandler}
					validationSchema={schema}
					initialValues={initialValues}>
					{({ values, setFieldValue, handleSubmit, isSubmitting }) => (
						<>
							{currentStep.step === "details" && (
								<AuditDetails
									currentLocation={currentLocation}
									setCurrentStep={setCurrentStep}
								/>
							)}

							{currentStep.step === "close-shot" && (
								<CloseShot
									PickImage={PickImage}
									onCloseShot={async () => {
										if (!closeShot) {
											showAndHideToast(
												"Please select or take a photo",
												"error"
											);
											return;
										}
										setCurrentStep({ num: 3, step: "long-shot" });
									}}
									TakeCloseShot={() => {
										TakeShot("close-shot");
									}}
									currentShot={closeShot}
									back={() => setCurrentStep({ num: 1, step: "details" })}
								/>
							)}

							{currentStep.step === "long-shot" && (
								<LongShot
									PickImage={PickImage}
									onLongShot={async () => {
										if (!longShot) {
											showAndHideToast(
												"Please select or take a photo",
												"error"
											);
											return;
										}
										setCurrentStep({ num: 4, step: "video" });
									}}
									TakeLongShot={() => {
										TakeShot("long-shot");
									}}
									currentShot={longShot}
									back={() => setCurrentStep({ num: 2, step: "close-shot" })}
								/>
							)}

							{currentStep.step === "video" && (
								<RecordVideo
									startRecording={TakeVideo}
									videoSource={video}
									back={() => setCurrentStep({ num: 3, step: "long-shot" })}
								/>
							)}

							{currentStep.step === "video" && video && (
								<View className="px-[15px]">
									<AppButton onPress={handleSubmit}>
										{isSubmitting && <Loader />}
										{!isSubmitting && (
											<AppText
												className="text-[17px] mt-[20px]"
												weight="Medium">
												Continue
											</AppText>
										)}
									</AppButton>
								</View>
							)}

							<BillboardTypes
								currentValue={values.billboardTypeId}
								setBoardType={(val: number) =>
									setFieldValue("billboardTypeId", val)
								}
							/>
						</>
					)}
				</Formik>
			)}
		</View>
	);
}
