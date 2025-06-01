import React from "react";
import { Stack } from "expo-router";
import AppHeader from "@/src/components/shared/AppHeader";

export default function _layout() {
	return (
		<Stack>
			<Stack.Screen name="index" options={{ headerShown: false }} />
			<Stack.Screen name="new-audit" />
			<Stack.Screen
				name="available-locations"
				options={{
					header: () => (
						<AppHeader
							showBack
							backIconFill="white"
							bgColor="#00100A"
							title="Available Locations"
							textColor="white"
						/>
					),
				}}
			/>
			<Stack.Screen
				name="pending-audits"
				options={{
					header: () => (
						<AppHeader
							showBack
							backIconFill="white"
							bgColor="#00100A"
							title="Pending Audits"
							textColor="white"
						/>
					),
				}}
			/>
			<Stack.Screen
				name="upload-reaudit"
				options={{
					header: () => (
						<AppHeader
							showBack
							backIconFill="white"
							bgColor="#00100A"
							title="Reaudit"
							textColor="white"
						/>
					),
				}}
			/>
		</Stack>
	);
}
