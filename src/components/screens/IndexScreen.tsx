import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Redirect } from "expo-router";
import useRootStore from "@/src/hooks/stores/useRootstore";
import { Image } from "expo-image";
import * as SecureStore from "expo-secure-store";
import ApiInstance from "@/src/utils/api-instance";
export default function IndexScreen() {
	const [loaded, setLoaded] = useState(false);
	const { isAuthenticated, setIsAuthenticated, setUserDetails } =
		useRootStore();

	useEffect(() => {
		(async function () {
			try {
				let credentials = await SecureStore.getItemAsync("credentials");
				if (!credentials) {
					throw new Error("Unauthorized");
				}
				credentials = JSON.parse(credentials);

				const response = await ApiInstance.get("/user/detail", {
					headers: {
						// @ts-ignore
						"auth-token": credentials?.accessToken,
					},
				});

				setUserDetails(response.data);
				setIsAuthenticated(true);
			} catch (error) {
				setIsAuthenticated(false);
			} finally {
				setLoaded(true);
			}
		})();
	}, []);

	if (loaded && isAuthenticated) {
		return <Redirect href={"/dashboard"} />;
	}

	if (loaded && !isAuthenticated) {
		return <Redirect href={"/auth"} />;
	}

	return (
		<View className="flex-1 items-center justify-center">
			<Image
				source={require("@/src/assets/images/oohiq-logo.png")}
				style={{
					width: 120,
					height: 115,
				}}
			/>
		</View>
	);
}
