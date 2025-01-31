import React from "react";
import * as SecureStore from "expo-secure-store";

export default function useCredentials() {
	const getCredentials = async () => {
		let credentials = await SecureStore.getItemAsync("credentials");

		if (!credentials) {
			return null;
		}

		credentials = JSON.parse(credentials!);

		return credentials;
	};

	const deleteCredentials = async function () {
		await SecureStore.deleteItemAsync("credentials");
	};

	return { getCredentials, deleteCredentials };
}
