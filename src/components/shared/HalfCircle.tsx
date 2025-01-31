import React from "react";
import { View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

const HalfCircle = ({ height = 90, width = 90 }) => {
	return (
		<View>
			<Svg height={height} width={width} viewBox="0 0 90 90">
				<Path
					d="M 0 45 A 45 45 0 0 0 90 45" // Path command for a semi-circle
					fill="#0000008F" // No fill inside
				/>
			</Svg>
		</View>
	);
};

export default HalfCircle;
