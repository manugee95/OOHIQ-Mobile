import React from "react";
import { Stack } from "expo-router";

export default function _layout() {
	return (
		<Stack>
			<Stack.Screen name="index" options={{ headerShown: false }} />
			<Stack.Screen name="forgotpassword" options={{ headerShown: false }} />
			<Stack.Screen name="passwordotp" options={{ headerShown: false }} />
			<Stack.Screen name="resetpassword" options={{ headerShown: false }} />
		</Stack>
	);
}
