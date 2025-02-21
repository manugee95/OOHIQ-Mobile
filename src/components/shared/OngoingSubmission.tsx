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
import AppButton from "./AppButton";
import { submissionRequestObject } from "@/src/utils/submission-requests";
import { Dimensions } from "react-native";
import { ActivityIndicator } from "react-native";

const { width } = Dimensions.get("screen");

let intervalId: NodeJS.Timeout;

const OngoingSubmission = function () {
	const submission = useRef<SubmissionRequest | null>(null);

	const progress = useSharedValue(0);
	const [percentage, setPercentage] = useState("");
	const [prgNum, setPrgNum] = useState(0);
	const showAndHideToast = useToast();
	const [hasError, setHasError] = useState(false);

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
	}, []);

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
				.then((data) => {
					// @ts-ignore
					delete submissionRequestObject[submission.current.address];
					submission.current = null;
					progress.value = 0;
					setPercentage("");
					setPrgNum(0);
					showAndHideToast("Submission complete", "success");
				})
				.catch((err) => {
					console.error(err);
					showAndHideToast("An error occurred while uploading", "error");

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
			}}
			className="absolute top-[4%] z-[999999] pr-[15px]">
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
				<AppButton
					onPress={upload}
					className="!bg-[#FF5E5E] !w-[100px] !h-[30px]">
					<AppText className="text-[15px] !text-white">Try Again</AppText>
				</AppButton>
			)}
		</View>
	);
};

const OngoingSubmissionList = function ({
	submission,
}: {
	submission: SubmissionRequest;
}) {
	return (
		<View className="px-[10px] absolute  z-[999999] w-full">
			<View className="flex flex-row items-center justify-between">
				<AppText className="text-[15px]" weight="SemiBold" numberOfLines={1}>
					{/* @ts-ignore */}
					{submission.address}
				</AppText>
			</View>
		</View>
	);
};

export default OngoingSubmission;
