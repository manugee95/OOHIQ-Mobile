import React from "react";
import { View } from "react-native";
import SelectBillboardType from "@/src/components/shared/billboard-type/SelectBillboardType";
import { useFormikContext } from "formik";
import { NewAuditData, Steps } from "./NewAuditScreen";
import AppInput from "@/src/components/shared/form/AppInput";
import AppButton from "@/src/components/shared/AppButton";
import AppText from "@/src/components/shared/AppText";
import SelectIndustry from "@/src/components/shared/industry/SelectIndustry";
import SelectAdvertiser from "@/src/components/shared/advertisers/SelectAdvertiser";
import SelectCategory from "@/src/components/shared/industry-category/SelectCategory";
import { ScrollView } from "react-native-gesture-handler";
import SelectBoardCondition from "@/src/components/shared/board-condition/SelectBoardCondition";
import SelectPosterCondition from "@/src/components/shared/poster-condition/SelectPosterCondition";
import SelectTrafficSpeed from "@/src/components/shared/traffic-speed/SelectTrafficSpeed";
import SelectEvaluationTime from "@/src/components/shared/evaluation-time/SelectEvaluationTime";

interface AuditDetailsProps {
	currentLocation: string;
	setCurrentStep: (val: { num: number; step: Steps }) => void;
}
export default function AuditDetails({
	currentLocation,
	setCurrentStep,
}: AuditDetailsProps) {
	const { errors, values, validateField, setFieldValue } =
		useFormikContext<NewAuditData>();

	return (
		<ScrollView>
			<View className="my-[30px] gap-y-[20px] px-[15px]">
				<SelectBillboardType
					errorMessage={errors.billboardTypeId}
					val={values.billboardTypeId}
				/>
				<SelectBoardCondition
					errorMessage={errors.boardConditionId}
					val={values.boardConditionId}
				/>
				<SelectPosterCondition
					errorMessage={errors.posterConditionId}
					val={values.posterConditionId}
				/>
				<SelectTrafficSpeed
					errorMessage={errors.trafficSpeedId}
					val={values.trafficSpeedId}
				/>
				<SelectEvaluationTime
					errorMessage={errors.evaluationTimeId}
					val={values.evaluationTimeId}
				/>
				<SelectAdvertiser
					errorMessage={errors.advertiserId}
					val={values.advertiserId}
				/>
				<SelectIndustry
					errorMessage={errors.industryId}
					val={values.industryId}
				/>
				<SelectCategory
					errorMessage={errors.categoryId}
					val={values.categoryId}
					industryId={values.industryId}
				/>
				<AppInput
					label="Brand"
					className="!bg-transparent border !border-[#ececec] focus:!border-primary"
					placeholder="Brand"
					value={values.brand}
					onChange={(val) => setFieldValue("brand", val)}
					errorMessage={errors.brand}
				/>
				<AppInput
					label="Brand Identifier"
					className="!bg-transparent border !border-[#ececec] focus:!border-primary"
					placeholder="Brand Identifier"
					value={values.brandIdentifier}
					onChange={(val) => setFieldValue("brandIdentifier", val)}
					errorMessage={errors.brandIdentifier}
				/>
				<View pointerEvents="none" className="w-full gap-y-[10px]">
					<AppInput
						label="Location"
						className="!bg-transparent border !border-[#ececec] focus:!border-primary"
						placeholder="Location"
						value={currentLocation}
						fromStart
					/>
				</View>
				<AppButton
					onPress={async () => {
						if (
							values.billboardTypeId === "" ||
							values.industryId === "" ||
							values.advertiserId === "" ||
							values.categoryId === "" ||
							values.brand === "" ||
							values.brandIdentifier === ""
						) {
							await validateField("billboardTypeId");
							await validateField("industryId");
							await validateField("advertiserId");
							await validateField("categoryId");
							await validateField("brand");
							await validateField("brandIdentifier");
						} else {
							setCurrentStep({ num: 2, step: "close-shot" });
						}
					}}>
					<AppText className="text-[17px]" weight="Medium">
						Continue
					</AppText>
				</AppButton>
			</View>
		</ScrollView>
	);
}
