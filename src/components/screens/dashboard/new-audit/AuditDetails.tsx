import React from "react";
import { View } from "react-native";
import SelectBillboardType from "@/src/components/shared/billboard-type/SelectBillboardType";
import { useFormikContext } from "formik";
import { NewAuditData, Steps } from "./NewAuditScreen";
import AppInput from "@/src/components/shared/form/AppInput";
import AppButton from "@/src/components/shared/AppButton";
import AppText from "@/src/components/shared/AppText";

interface AuditDetailsProps {
	currentLocation: string;
	setCurrentStep: (val: { num: number; step: Steps }) => void;
}
export default function AuditDetails({
	currentLocation,
	setCurrentStep,
}: AuditDetailsProps) {
	const { errors, values, validateField } = useFormikContext<NewAuditData>();

	return (
		<View className="mt-[30px] gap-y-[20px]  px-[15px]">
			<SelectBillboardType
				errorMessage={errors.billboardTypeId}
				val={values.billboardTypeId}
			/>
			<View pointerEvents="none" className="w-full gap-y-[10px]">
				<AppInput
					label="Location"
					className="!bg-transparent border !border-[#ececec] focus:!border-primary"
					placeholder="Location"
					value={currentLocation}
				/>
			</View>
			<AppButton
				onPress={async () => {
					if (values.billboardTypeId === "") {
						await validateField("billboardTypeId");
					} else {
						setCurrentStep({ num: 2, step: "close-shot" });
					}
				}}>
				<AppText className="text-[17px]" weight="Medium">
					Continue
				</AppText>
			</AppButton>
		</View>
	);
}
