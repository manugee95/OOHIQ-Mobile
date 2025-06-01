import AppHeader from "@/src/components/shared/AppHeader";
import { Stack } from "expo-router";
import React, { useCallback, useState } from "react";
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
import { submissionRequestObject } from "@/src/utils/submission-requests";
import Industries from "@/src/components/shared/industry/Industries";
import Advertisers from "@/src/components/shared/advertisers/Advertisers";
import Categories from "@/src/components/shared/industry-category/Categories";
import { writeAsync, readAsync } from "@lodev09/react-native-exify";
import RNPhotoManipulator, { MimeType } from "react-native-photo-manipulator";
import * as SecureStore from "expo-secure-store";
import BoardConditions from "@/src/components/shared/board-condition/BoardConditions";
import PosterConditions from "@/src/components/shared/poster-condition/PosterConditions";
import TrafficSpeeds from "@/src/components/shared/traffic-speed/TrafficSpeeds";
import EvaluationTime from "@/src/components/shared/evaluation-time/EvaluationTime";

export type Steps = "details" | "close-shot" | "long-shot" | "video";

export interface NewAuditData {
	userId: number;
	billboardTypeId: number | string;
	latitude: number | string;
	longitude: number | string;
	advertiserId: number | string;
	categoryId: number | string;
	industryId: number | string;
	brand: string;
	brandIdentifier: string;
	boardConditionId: string;
	posterConditionId: string;
	trafficSpeedId: string;
	evaluationTimeId: string;
	[string: string]: string | number;
}

const schema = Yup.object().shape({
	userId: Yup.string().required(),
	billboardTypeId: Yup.string().required().label("Billboard Type"),
	latitude: Yup.number().required().label("Location"),
	longitude: Yup.number().required().label("Location"),
	industryId: Yup.string().required().label("Industry"),
	advertiserId: Yup.string().required().label("Industry"),
	categoryId: Yup.string().required().label("Category"),
	brand: Yup.string().required().label("Brand"),
	brandIdentifier: Yup.string().required().label("Brand Identifier"),
});

export default function NewAuditScreen({
	isReaudit,
	currentLocationStr = "",
	reAuditID,
	longitude,
	latitude,
}: {
	isReaudit?: boolean;
	currentLocationStr?: string;
	reAuditID?: number;
	longitude?: number;
	latitude?: number;
}) {
	const showAndHideToast = useToast();
	const { userDetails } = useRootStore();
	const { getCredentials } = useCredentials();
	const [coordinates, setCoordinates] = useState({
		longitude: longitude ?? 0,
		latitude: latitude ?? 0,
	});
	const [status, requestCameraPermission] = useCameraPermissions();
	const [micStatus, requestMicPermission] = useMicrophonePermissions();

	const [isGettingLocation, setIsGettingLocation] = useState(!isReaudit);
	const [isTakingVideo, setIsTakingVideo] = useState(false);
	const [closeShot, setCloseShot] = useState<
		ImagePickerAsset | MediaLibrary.Asset | null
	>(null);
	const [longShot, setLongShot] = useState<
		ImagePickerAsset | MediaLibrary.Asset | null
	>(null);
	const [video, setVideo] = useState<string | null>(null);
	const [currentLocation, setCurrentLocation] = useState(currentLocationStr);
	const [currentStep, setCurrentStep] = useState<{ num: number; step: Steps }>({
		num: 1,
		step: "details",
	});

	const [isSubmitted, setIsSubmitted] = useState(false);

	useFocusEffect(
		useCallback(() => {
			if (!isReaudit) {
				getForegroundPermissionsAsync().then(async (val) => {
					if (val.granted) {
						const { granted } = await MediaLibrary.getPermissionsAsync();
						if (granted) {
							getCurrentLocation();
						} else {
							const { granted } = await MediaLibrary.requestPermissionsAsync();
							if (!granted) {
								showAndHideToast("Media Library Permission denied", "error");
							} else {
								getCurrentLocation();
							}
						}
					} else {
						requestForegroundPermissionsAsync().then(async (val) => {
							if (val.granted) {
								const { granted } = await MediaLibrary.getPermissionsAsync();
								if (granted) {
									getCurrentLocation();
								} else {
									const { granted } =
										await MediaLibrary.requestPermissionsAsync();
									if (!granted) {
										showAndHideToast(
											"Media Library Permission denied",
											"error"
										);
									} else {
										getCurrentLocation();
									}
								}
							} else {
								showAndHideToast("Location access Permission denied", "error");
							}
						});
					}
				});
			}
		}, [])
	);

	function getCurrentLocation() {
		getCurrentPositionAsync({
			accuracy: LocationAccuracy.Highest,
		}).then(async ({ coords }) => {
			const apiKey = await SecureStore.getItemAsync("googleApiKey");
			const response = await googleMapClient.reverseGeocode({
				params: {
					key: apiKey ?? "",
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
		try {
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
		} catch (error) {
			console.log(error);
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
			} else {
				showAndHideToast("Camera Permission not granted", "error");
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

	async function watermarkImage(uri: string, height: number) {
		const tags = await readAsync(uri);
		const watermarkImage = require("../../../../assets/images/watermark.png");

		if (tags && tags.Orientation !== undefined && tags.Orientation !== null) {
			const path = await RNPhotoManipulator.overlayImage(
				closeShot?.uri!,
				watermarkImage,
				{ x: 20, y: height - 200 },
				MimeType.PNG
			);

			const res = await writeAsync(path, {
				...tags,
				Orientation: tags.Orientation !== 1 ? 1 : tags.Orientation,
			});

			if (res) {
				const asset = await MediaLibrary.createAssetAsync(res.uri);

				return asset;
			}
		}
	}

	const formDataToJSON = function (formData: FormData) {
		const json: Record<string, any> = {};
		formData.forEach((value, key) => {
			// If it's a File or Blob, you'll need custom handling (see below)
			json[key] = value;
		});
		return JSON.stringify(json);
	};

	const submitHandler = async function (
		values: NewAuditData,
		{ setSubmitting }: FormikHelpers<NewAuditData>
	) {
		try {
			const data = new FormData();
			const credentials = await getCredentials();

			if (!closeShot || !longShot || !video) {
				throw new Error("Media files are required");
			}

			Object.keys(values).forEach((key: string) => {
				data.append(key, values[key].toString());
			});

			const closeAss = await MediaLibrary.createAssetAsync(closeShot?.uri);
			const longAss = await MediaLibrary.createAssetAsync(longShot?.uri);
			const videoAss = await MediaLibrary.createAssetAsync(video);

			if (closeAss && longAss && videoAss) {
				const newCloseShot = await MediaLibrary.getAssetInfoAsync(closeAss);
				const newLongShot = await MediaLibrary.getAssetInfoAsync(longAss);
				const newVideo = await MediaLibrary.getAssetInfoAsync(videoAss);

				// mime type gets .mov videos as video/quicktime which is not supported on the server, so we manually set the type as video/mov
				const videoFilename = newVideo.filename.split(".");
				const fileExtension = videoFilename[videoFilename.length - 1];
				const videoMediaType = `${newVideo.mediaType}/${fileExtension}`;

				// @ts-ignore
				data.append("closeShot", {
					uri: Platform.OS === "ios" ? newCloseShot.localUri : newCloseShot.uri,
					name: newCloseShot?.filename,
					type: mime.getType(newCloseShot.uri),
				});

				// @ts-ignore
				data.append("longShot", {
					uri: Platform.OS === "ios" ? newLongShot.localUri : newLongShot.uri,
					name: newLongShot?.filename,
					type: mime.getType(newLongShot.uri),
				});

				// @ts-ignore
				data.append("video", {
					uri: Platform.OS === "ios" ? newVideo.localUri : newVideo.uri,
					name: "audit-vid",
					type: videoMediaType,
				});

				const json = formDataToJSON(data);

				let pendingSubmissions: any = await SecureStore.getItemAsync(
					"pendingSubmissions"
				);

				if (!pendingSubmissions) {
					pendingSubmissions = {};
					pendingSubmissions[currentLocation] = json;
				} else {
					pendingSubmissions = JSON.parse(pendingSubmissions);
					pendingSubmissions[currentLocation] = json;
				}

				await SecureStore.setItemAsync(
					"pendingSubmissions",
					JSON.stringify(pendingSubmissions)
				);

				const submissionRequest = async function (cb: (val: any) => void) {
					const response = await ApiInstance.post(
						!isReaudit ? "/new-audit" : `api/re-audit/${reAuditID}`,
						data,
						{
							headers: {
								// @ts-ignore
								"auth-token": credentials.accessToken,
								"Content-Type": "multipart/form-data",
							},
							onUploadProgress: (progressEvent) => {
								const totalLength = progressEvent.total;
								if (totalLength) {
									const progress = Math.round(
										(progressEvent.loaded * 100) / totalLength
									);
									cb(progress);
								}
							},
						}
					);

					return response.data;
				};

				submissionRequest.address = currentLocation;

				submissionRequestObject[currentLocation] = submissionRequest;

				showAndHideToast("Your submission is being uploaded!", "success");
				setIsSubmitted(true);
			}
		} catch (error) {
			const err = error as AxiosError<any>;
			showAndHideToast(err.response?.data?.message ?? err.message, "error");
			setSubmitting(false);
		}
	};

	const initialValues: NewAuditData = {
		userId: userDetails?.id!,
		billboardTypeId: "",
		latitude: coordinates.latitude,
		longitude: coordinates.longitude,
		brand: "",
		brandIdentifier: "",
		industryId: "",
		advertiserId: "",
		categoryId: "",
		boardConditionId: "",
		posterConditionId: "",
		trafficSpeedId: "",
		evaluationTimeId: "",
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
					{({ values, setFieldValue, handleSubmit, isSubmitting, errors }) => (
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
									<AppButton
										disabled={isSubmitting}
										onPress={() => {
											handleSubmit();
										}}>
										{isSubmitting && <Loader />}
										{!isSubmitting && (
											<AppText className="text-[17px]" weight="Medium">
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

							<Industries
								currentValue={values.industryId}
								setIndustry={(val: number) => {
									setFieldValue("industryId", val);
									setFieldValue("categoryId", "");
								}}
							/>

							<Advertisers
								currentValue={values.advertiserId}
								setAdvertiser={(val: number) =>
									setFieldValue("advertiserId", val)
								}
							/>

							<Categories
								currentValue={values.categoryId}
								setCategory={(val: number) => setFieldValue("categoryId", val)}
								industryId={values.industryId}
							/>

							<BoardConditions
								currentValue={values.boardConditionId}
								setBoardCondition={(val: number) =>
									setFieldValue("boardConditionId", val)
								}
							/>

							<PosterConditions
								currentValue={values.posterConditionId}
								setPosterCondition={(val: number) =>
									setFieldValue("posterConditionId", val)
								}
							/>

							<TrafficSpeeds
								currentValue={values.trafficSpeedId}
								setTrafficSpeed={(val: number) =>
									setFieldValue("trafficSpeedId", val)
								}
							/>

							<EvaluationTime
								currentValue={values.evaluationTimeId}
								setEvaluationTime={(val: number) =>
									setFieldValue("evaluationTimeId", val)
								}
							/>
						</>
					)}
				</Formik>
			)}
		</View>
	);
}
