import React from "react";
import { Stack } from "expo-router";
import AppHeader from "@/src/components/shared/AppHeader";

export default function layout() {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					header: () => (
						<AppHeader
							showBack
							backIconFill="white"
							bgColor="#00100A"
							title="Uploads"
							textColor="white"
						/>
					),
				}}
			/>
			<Stack.Screen
				name="evaluate"
				options={{
					header: () => (
						<AppHeader
							showBack
							backIconFill="white"
							bgColor="#00100A"
							title="Evaluate Audit"
							textColor="white"
						/>
					),
				}}
			/>
		</Stack>
	);
}
