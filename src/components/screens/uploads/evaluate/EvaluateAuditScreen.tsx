import React from "react";
import { ScrollView, View } from "react-native";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import useToast from "@/src/hooks/useToast";
import useRootStore from "@/src/hooks/stores/useRootstore";
import { AxiosError } from "axios";
import ApiInstance from "@/src/utils/api-instance";
import useUploadsStore from "@/src/hooks/stores/useUploadsStore";
import AppText from "@/src/components/shared/AppText";
import AppInput from "@/src/components/shared/form/AppInput";
import useCredentials from "@/src/hooks/useCredentials";
import SelectRoadType from "@/src/components/shared/road-type/SelectRoadType";
import SelectVehicularTraffic from "@/src/components/shared/vehicular-traffic/SelectVehicularTraffic";
import SelectPedestrianTraffic from "@/src/components/shared/pedestrian-traffic/SelectPedestrianTraffic";
import SelectDistanceOfVisibility from "@/src/components/shared/distance-of-visibility/SelectDistanceOfVisibility";
import SelectBoardPositioning from "@/src/components/shared/board-positioning/SelectBoardPositioning";
import SelectBoardLevel from "@/src/components/shared/board-level/SelectBoardLevel";
import SelectVisibilityPoints from "@/src/components/shared/visibility-points/SelectVisibilityPoints";
import SelectSpecialFeature from "@/src/components/shared/special-features/SelectSpecialFeature";
import SelectBoardInView from "@/src/components/shared/boards-in-view/SelectBoardInView";
import SelectCompetitiveBoard from "@/src/components/shared/competitive-boards/SelectCompetitiveBoard";
import SelectLargerBoard from "@/src/components/shared/larger-boards/SelectLargerBoard";
import SelectCompetitiveBoardType from "@/src/components/shared/billboard-type/SelectCompetitiveBoardType";
import RoadTypes from "@/src/components/shared/road-type/RoadTypes";
import VehicularTraffic from "@/src/components/shared/vehicular-traffic/VehicularTraffic";
import PedestrianTraffic from "@/src/components/shared/pedestrian-traffic/PedestrianTraffic";
import DistanceOfVisibility from "@/src/components/shared/distance-of-visibility/DistanceOfVisibility";
import BoardPositioning from "@/src/components/shared/board-positioning/BoardPositioning";
import BoardLevel from "@/src/components/shared/board-level/BoardLevel";
import VisibilityPoints from "@/src/components/shared/visibility-points/VisibilityPoints";
import SpecialFeatures from "@/src/components/shared/special-features/SpecialFeatures";
import BoardsInView from "@/src/components/shared/boards-in-view/BoardsInView";
import CompetitiveBoardTypes from "@/src/components/shared/billboard-type/CompetitiveBoardTypes";
import CompetitiveBoards from "@/src/components/shared/competitive-boards/CompetitiveBoards";
import LargerBoards from "@/src/components/shared/larger-boards/LargerBoards";
import AppButton from "@/src/components/shared/AppButton";
import Loader from "@/src/components/shared/Loader";
import { router } from "expo-router";

const schema = Yup.object().shape({
	phone: Yup.string()
		.matches(/^\d{11}$/, "Phone number must be 11 digits")
		.required("Phone is required"),

	contractorName: Yup.string().required("Contractor name is required"),

	roadTypeId: Yup.number().integer().required("Road Type  is required"),

	vehicularTrafficId: Yup.number()
		.integer()
		.required("Vehicular Traffic is required"),

	pedestrianTrafficId: Yup.number()
		.integer()
		.required("Pedestrian Traffic is required"),

	distanceOfVisibilityId: Yup.number()
		.integer()
		.required("Distance of Visibility is required"),

	boardPositioningId: Yup.number()
		.integer()
		.required("Board Positioning is required"),

	boardLevelId: Yup.number().integer().required("Board Level is required"),

	visibilityPointsId: Yup.number()
		.integer()
		.required("Visibility Point is required"),

	specialFeaturesId: Yup.number()
		.integer()
		.required("Special Feature is required"),

	noOfBoardsInViewId: Yup.number()
		.integer()
		.required("Number of Boards in View is required"),

	noOfCompetitiveBoardsId: Yup.number()
		.integer()
		.required("Number of Competitive Boards is required"),

	noOfLargerBoardsId: Yup.number()
		.integer()
		.required("Number of Larger Boards is required"),

	competitiveBoardTypesId: Yup.array()
		.of(Yup.number().integer())
		.min(1, "At least one competitive board type is required")
		.required("Competitive Board Types are required"),
});

interface EvaluationData {
	phone: string;
	contractorName: string;
	roadTypeId: number | string;
	vehicularTrafficId: number | string;
	pedestrianTrafficId: number | string;
	distanceOfVisibilityId: number | string;
	boardPositioningId: number | string;
	boardLevelId: number | string;
	visibilityPointsId: number | string;
	specialFeaturesId: number | string;
	noOfBoardsInViewId: number | string;
	noOfCompetitiveBoardsId: number | string;
	noOfLargerBoardsId: number | string;
	competitiveBoardTypesId: (number | string)[];
}

export default function EvaluateAuditScreen() {
	const { auditToEvaluate } = useUploadsStore();
	const showAndHideToast = useToast();
	const { userDetails } = useRootStore();
	const { getCredentials } = useCredentials();

	const initialValues: EvaluationData = {
		phone: "",
		contractorName: "",
		roadTypeId: "",
		vehicularTrafficId: "",
		pedestrianTrafficId: "",
		distanceOfVisibilityId: "",
		boardPositioningId: "",
		boardLevelId: "",
		visibilityPointsId: "",
		specialFeaturesId: "",
		noOfBoardsInViewId: "",
		noOfCompetitiveBoardsId: "",
		noOfLargerBoardsId: "",
		competitiveBoardTypesId: [],
	};

	const submitHandler = async (
		values: EvaluationData,
		{ setSubmitting, resetForm }: FormikHelpers<EvaluationData>
	) => {
		try {
			const credentials = await getCredentials();

			await ApiInstance.post(
				"/api/billboard-evaluation/" + auditToEvaluate?.id,
				values,
				{
					headers: {
						// @ts-ignore
						"auth-token": credentials.accessToken,
					},
				}
			);

			showAndHideToast("Audit is being evaluated!", "success");

			router.replace("/uploads");
			resetForm();
		} catch (error) {
			const err = error as AxiosError<any>;
			showAndHideToast(err.response?.data?.message ?? err.message, "error");
			setSubmitting(false);
		}
	};

	return (
		<View className="flex-1 p-[10px] bg-white">
			<Formik
				initialValues={initialValues}
				validationSchema={schema}
				onSubmit={submitHandler}>
				{({
					values,
					errors,
					setFieldValue,
					handleSubmit,
					isSubmitting,
					isValidating,
				}) => (
					<>
						<View className="pb-[10px] border-b border-b-[#d4d4d4] mb-[10px]">
							<AppText className="text-[17px]">
								{auditToEvaluate?.location}
							</AppText>
						</View>
						<ScrollView showsVerticalScrollIndicator={false}>
							<View className="gap-y-5 pb-[30px]">
								<AppInput
									label="Contractor Name"
									placeholder="Contractor Name"
									className="!bg-[#f5f5f5]"
									onChange={(val) =>
										setFieldValue("contractorName", val, false)
									}
									errorMessage={errors.contractorName}
									value={values.contractorName}
								/>
								<AppInput
									label="Phone Number"
									placeholder="Phone Number"
									className="!bg-[#f5f5f5]"
									onChange={(val) => setFieldValue("phone", val, false)}
									errorMessage={errors.phone}
									value={values.phone}
								/>
								<SelectRoadType
									errorMessage={errors.roadTypeId}
									val={values.roadTypeId}
								/>
								<SelectVehicularTraffic
									errorMessage={errors.vehicularTrafficId}
									val={values.vehicularTrafficId}
								/>
								<SelectPedestrianTraffic
									errorMessage={errors.pedestrianTrafficId}
									val={values.pedestrianTrafficId}
								/>
								<SelectDistanceOfVisibility
									errorMessage={errors.distanceOfVisibilityId}
									val={values.distanceOfVisibilityId}
								/>
								<SelectBoardPositioning
									errorMessage={errors.boardPositioningId}
									val={values.boardPositioningId}
								/>
								<SelectBoardLevel
									errorMessage={errors.boardLevelId}
									val={values.boardLevelId}
								/>
								<SelectVisibilityPoints
									errorMessage={errors.visibilityPointsId}
									val={values.visibilityPointsId}
								/>
								<SelectSpecialFeature
									errorMessage={errors.specialFeaturesId}
									val={values.specialFeaturesId}
								/>
								<SelectBoardInView
									errorMessage={errors.noOfBoardsInViewId}
									val={values.noOfBoardsInViewId}
								/>
								<SelectCompetitiveBoard
									errorMessage={errors.noOfCompetitiveBoardsId}
									val={values.noOfCompetitiveBoardsId}
								/>
								<SelectLargerBoard
									errorMessage={errors.noOfLargerBoardsId}
									val={values.noOfLargerBoardsId}
								/>
								<SelectCompetitiveBoardType
									errorMessage={errors.competitiveBoardTypesId as string}
									selectedTypes={values.competitiveBoardTypesId}
									setCompetitiveBoardType={(val) =>
										setFieldValue("competitiveBoardTypesId", val, false)
									}
								/>
								<AppButton
									className="mt-[20px]"
									disabled={isSubmitting}
									onPress={() => {
										handleSubmit();
									}}>
									{isSubmitting && <Loader />}
									{!isSubmitting && (
										<AppText className="text-[17px]" weight="Medium">
											Submit
										</AppText>
									)}
								</AppButton>
							</View>
						</ScrollView>
						<RoadTypes
							currentValue={values.roadTypeId}
							setRoadType={(val) => setFieldValue("roadTypeId", val, false)}
						/>
						<VehicularTraffic
							currentValue={values.vehicularTrafficId}
							setVehicularTraffic={(val) =>
								setFieldValue("vehicularTrafficId", val, false)
							}
						/>
						<PedestrianTraffic
							currentValue={values.pedestrianTrafficId}
							setPedestrianTraffic={(val) =>
								setFieldValue("pedestrianTrafficId", val, false)
							}
						/>
						<DistanceOfVisibility
							currentValue={values.distanceOfVisibilityId}
							setDistanceOfVisibility={(val) =>
								setFieldValue("distanceOfVisibilityId", val, false)
							}
						/>
						<BoardPositioning
							currentValue={values.boardPositioningId}
							setBoardPositioning={(val) =>
								setFieldValue("boardPositioningId", val, false)
							}
						/>
						<BoardLevel
							currentValue={values.boardLevelId}
							setBoardLevel={(val) => setFieldValue("boardLevelId", val, false)}
						/>
						<VisibilityPoints
							currentValue={values.visibilityPointsId}
							setVisibilityPoints={(val) =>
								setFieldValue("visibilityPointsId", val, false)
							}
						/>
						<SpecialFeatures
							currentValue={values.specialFeaturesId}
							setSpecialFeature={(val) =>
								setFieldValue("specialFeaturesId", val, false)
							}
						/>
						<BoardsInView
							currentValue={values.noOfBoardsInViewId}
							setBoardInView={(val) =>
								setFieldValue("noOfBoardsInViewId", val, false)
							}
						/>
						<CompetitiveBoards
							currentValue={values.noOfCompetitiveBoardsId}
							setNoOfCompetitiveBoards={(val) =>
								setFieldValue("noOfCompetitiveBoardsId", val, false)
							}
						/>
						<LargerBoards
							currentValue={values.noOfLargerBoardsId}
							setNoOfLargerBoards={(val) =>
								setFieldValue("noOfLargerBoardsId", val, false)
							}
						/>
						<CompetitiveBoardTypes
							currentValue={values.competitiveBoardTypesId}
							setBoardType={(val) =>
								setFieldValue("competitiveBoardTypesId", val, false)
							}
						/>
					</>
				)}
			</Formik>
		</View>
	);
}
