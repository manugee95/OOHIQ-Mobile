import React, { PropsWithChildren } from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import AppText from "./AppText";

type CircularProgressProps = {
	percentage: number; // Percentage to fill (0 to 100)
	radius?: number; // Radius of the circle
	strokeWidth?: number; // Thickness of the stroke
	color?: string; // Color of the progress
	backgroundColor?: string; // Background color of the circle
	label?: string;
};

const CircularProgress = ({
	percentage,
	radius = 50,
	strokeWidth = 10,
	color = "#14D703",
	backgroundColor = "#DFDFDF",
	label,
}: CircularProgressProps) => {
	const normalizedRadius = radius - strokeWidth / 2;
	const circumference = 2 * Math.PI * normalizedRadius;
	const strokeDashoffset = circumference - (circumference * percentage) / 100;

	return (
		<View className="items-center justify-center relative">
			<Svg width={radius * 2} height={radius * 2}>
				{/* Background Circle */}
				<Circle
					stroke={backgroundColor}
					fill="none"
					cx={radius}
					cy={radius}
					r={normalizedRadius}
					strokeWidth={strokeWidth}
				/>
				{/* Progress Circle */}
				<Circle
					stroke={color}
					fill="none"
					cx={radius}
					cy={radius}
					r={normalizedRadius}
					strokeWidth={strokeWidth}
					strokeDasharray={`${circumference} ${circumference}`}
					strokeDashoffset={strokeDashoffset}
					strokeLinecap="round"
					rotation="90"
					origin={`${radius}, ${radius}`}
				/>
			</Svg>
			{/* Percentage Label */}
			<View className="absolute items-center justify-center">
				<AppText weight="Bold" className="text-[57px] text-white">
					{label ?? `${Math.round(percentage)}`}
					<AppText className="text-white text-[22px]" weight="Bold">
						%
					</AppText>
				</AppText>
			</View>
		</View>
	);
};

CircularProgress.WithChildren = ({
	percentage,
	radius = 50,
	strokeWidth = 10,
	color = "#14D703",
	children,
}: CircularProgressProps & PropsWithChildren) => {
	const normalizedRadius = radius - strokeWidth / 2;
	const circumference = 2 * Math.PI * normalizedRadius;
	const strokeDashoffset = circumference - (circumference * percentage) / 100;

	return (
		<View className="items-center justify-center w-max">
			<Svg width={radius * 2} height={radius * 2}>
				{/* Progress Circle */}
				<Circle
					stroke={color}
					fill="none"
					cx={radius}
					cy={radius}
					r={normalizedRadius}
					strokeWidth={strokeWidth}
					strokeDasharray={`${circumference} ${circumference}`}
					strokeDashoffset={strokeDashoffset}
					strokeLinecap="round"
					rotation="-90"
					origin={`${radius}, ${radius}`}
				/>
			</Svg>
			<View className="absolute items-center justify-center">{children}</View>
		</View>
	);
};

export default CircularProgress;
