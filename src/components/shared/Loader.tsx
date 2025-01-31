import React from "react";
import LottieView from "lottie-react-native";
import { View } from "react-native";

export default function Loader({ useWhite = false }) {
	return (
		<View
			className="items-center justify-center"
			style={{ height: "100%", width: "100%" }}>
			<LottieView
				source={
					useWhite
						? require("@/src/assets/lottie/loader2.json")
						: require("@/src/assets/lottie/loader.json")
				}
				autoPlay
				loop
				style={{ width: 250, height: 70 }}
			/>
		</View>
	);
}
