import React from "react";
import { StyleSheet } from "react-native";
import { Image } from "expo-image";

export default function Avatar({
	src,
	size = 50,
	style,
}: {
	src: string;
	size?: number;
	style?: any;
}) {
	return (
		<Image
			source={{
				uri: src,
			}}
			style={[styles.avatar, { width: size, height: size }, style]}
			contentFit="cover"
		/>
	);
}

const styles = StyleSheet.create({
	avatar: {
		borderRadius: 999,
	},
});
