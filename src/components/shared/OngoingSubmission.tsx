import React, { useEffect, useRef, useState } from "react";
import BottomSheet from "./BottomSheet";
import { View } from "react-native";
import useRootStore, {
	SubmissionRequest,
} from "@/src/hooks/stores/useRootstore";
import AppText from "./AppText";
import Animated, {
	useSharedValue,
	Easing,
	withTiming,
	useAnimatedStyle,
} from "react-native-reanimated";
import useToast from "@/src/hooks/useToast";
import { submissionRequestObject } from "@/src/utils/submission-requests";
import { Dimensions } from "react-native";
import { ActivityIndicator } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import * as SecureStore from "expo-secure-store";
import * as FileSystem from "expo-file-system";
import mime from "mime";
import ApiInstance from "@/src/utils/api-instance";
import useCredentials from "@/src/hooks/useCredentials";

const { width } = Dimensions.get("screen");

let intervalId: NodeJS.Timeout;

type FileLike = {
	uri: string;
	name: string;
	type: string;
};

const OngoingSubmission = function () {
	const submission = useRef<SubmissionRequest | null>(null);

	const progress = useSharedValue(0);
	const [percentage, setPercentage] = useState("");
	const [prgNum, setPrgNum] = useState(0);
	const showAndHideToast = useToast();
	const [hasError, setHasError] = useState(false);
	const { setUserDetails, userDetails, isAuthenticated } = useRootStore();
	const { getCredentials } = useCredentials();

	useEffect(() => {
		if (isAuthenticated) {
			(async function () {
				// await SecureStore.deleteItemAsync("pendingSubmissions");
				let pendingSubmissions: any = await SecureStore.getItemAsync(
					"pendingSubmissions"
				);
				if (pendingSubmissions) {
					pendingSubmissions = JSON.parse(pendingSubmissions);
					Object.keys(pendingSubmissions).forEach(async (key) => {
						try {
							const data = JSON.parse(pendingSubmissions[key]);
							const formdata = await buildFormData(data);

							const credentials = await getCredentials();

							const submissionRequest = async function (
								cb: (val: any) => void
							) {
								const response = await ApiInstance.post(
									"/new-audit",
									formdata,
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

							submissionRequest.address = key;

							submissionRequestObject[key] = submissionRequest;
						} catch (error) {
							// @ts-ignore
							console.warn(error.message);
						}
					});
				}
			})();
		}
	}, [isAuthenticated]);

	useEffect(() => {
		intervalId = setInterval(() => {
			const requests = Object.values(submissionRequestObject);
			if (requests.length > 0 && submission.current === null) {
				submission.current = requests[0];
				upload();
			}
		}, 1000);
		return () => {
			clearInterval(intervalId);
		};
	}, [userDetails]);

	function isFileLike(value: any): value is FileLike {
		return (
			value &&
			typeof value === "object" &&
			typeof value.uri === "string" &&
			typeof value.name === "string" &&
			typeof value.type === "string"
		);
	}

	async function buildFormData(data: Record<string, any>): Promise<FormData> {
		const formData = new FormData();

		for (const [key, value] of Object.entries(data)) {
			if (isFileLike(value)) {
				const fileInfo = await FileSystem.getInfoAsync(value.uri);

				if (fileInfo.exists) {
					formData.append(key, {
						uri: value.uri,
						name: value.name,
						type: value.type,
					} as any); // TS workaround for React Native FormData
				} else {
					throw new Error(
						`File for key "${key}" not found at URI: ${value.uri}`
					);
				}
			} else {
				formData.append(key, value);
			}
		}

		return formData;
	}

	function upload() {
		setHasError(false);
		if (submission.current) {
			submission
				.current((val) => {
					progress.value = withTiming(val, {
						easing: Easing.linear,
					});
					setPercentage(`${val}%`);
					setPrgNum(val);
				})
				.then(async (data) => {
					let pendingSubmissions: any = await SecureStore.getItemAsync(
						"pendingSubmissions"
					);

					if (pendingSubmissions) {
						pendingSubmissions = JSON.parse(pendingSubmissions);
						// @ts-ignore
						delete pendingSubmissions[submission.current.address];
						await SecureStore.setItemAsync(
							"pendingSubmissions",
							JSON.stringify(pendingSubmissions)
						);
					}

					// @ts-ignore
					delete submissionRequestObject[submission.current.address];
					submission.current = null;
					progress.value = 0;
					setPercentage("");
					setPrgNum(0);
					showAndHideToast("Submission complete", "success");
					if (userDetails) {
						const newCount = userDetails?.auditCount + 1;
						setUserDetails({
							...userDetails,
							auditCount: newCount,
						});
					}
				})
				.catch((err) => {
					console.error(err.response.data);
					showAndHideToast(
						err.response.data.message ?? "An error occurred while uploading",
						"error"
					);

					setHasError(true);
					setPercentage("");
					setPrgNum(0);
					progress.value = 0;
				});
		}
	}

	const style = useAnimatedStyle(() => {
		return {
			width: `${progress.value}%`,
		};
	});

	return (
		<View
			style={{
				width,
				opacity: !hasError && prgNum > 0 ? 1 : hasError && prgNum === 0 ? 1 : 0,
				zIndex: 99999999999,
			}}
			className="absolute top-[4%] z-[9999999999999] pr-[15px]">
			{!hasError && (
				<View className="flex-row items-center justify-between">
					<View className="w-[90%] h-[5px] bg-[#f5f5f5]">
						<Animated.View
							className={"bg-primary h-full"}
							style={style}></Animated.View>
					</View>
					<View className="flex flex-row items-center justify-between">
						{prgNum === 100 && <ActivityIndicator size={"small"} />}
						{prgNum < 100 && (
							<AppText className="text-[12px] !text-white">
								{percentage}
							</AppText>
						)}
					</View>
				</View>
			)}
			{hasError && (
				<View className="flex-row items-center">
					<Pressable
						onPress={() => {
							upload();
						}}
						style={{
							width: 100,
							height: 30,
							borderRadius: 10,
							marginLeft: 10,
							backgroundColor: "#3DF3A9",
							alignItems: "center",
							justifyContent: "center",
						}}>
						<AppText className="text-[15px] !text-white text-center">
							Try Again
						</AppText>
					</Pressable>
					<Pressable
						onPress={async () => {
							try {
								let pendingSubmissions: any = await SecureStore.getItemAsync(
									"pendingSubmissions"
								);

								if (pendingSubmissions) {
									pendingSubmissions = JSON.parse(pendingSubmissions);
									// @ts-ignore
									delete pendingSubmissions[submission.current.address];
									await SecureStore.setItemAsync(
										"pendingSubmissions",
										JSON.stringify(pendingSubmissions)
									);
								}
								// @ts-ignore
								delete submissionRequestObject[submission.current?.address];
								submission.current = null;
								progress.value = 0;
								setPercentage("");
								setPrgNum(0);
								setHasError(false);
							} catch (error) {
								console.log(error);
							}
						}}
						style={{
							width: 100,
							height: 30,
							backgroundColor: "#FF5E5E",
							borderRadius: 10,
							marginLeft: 10,
							alignItems: "center",
							justifyContent: "center",
						}}>
						<AppText className="text-[15px] !text-white text-center">
							Cancel
						</AppText>
					</Pressable>
				</View>
			)}
		</View>
	);
};

export default OngoingSubmission;
