import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { useEffect, useState, useRef } from "react";
import { router } from "expo-router";
import ApiInstance from "../utils/api-instance";
import useCredentials from "./useCredentials";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
	}),
});

export default function useNotifications() {
	const [expoPushToken, setExpoPushToken] = useState("");
	const [notification, setNotification] = useState<
		Notifications.Notification | undefined
	>(undefined);
	const notificationListener = useRef<Notifications.EventSubscription>();
	const responseListener = useRef<Notifications.EventSubscription>();

	const { getCredentials } = useCredentials();

	useEffect(() => {
		registerForPushNotificationsAsync()
			.then((token) => {
				// console.log(token);
				if (token) {
					setExpoPushToken(token);
				}
			})
			.catch((e) => {
				console.log(e);
			});

		notificationListener.current =
			Notifications.addNotificationReceivedListener((notification) => {
				console.log(notification);
				setNotification(notification);
			});

		responseListener.current =
			Notifications.addNotificationResponseReceivedListener((response) => {
				console.log(response?.notification?.request.content);
				// if (response?.notification?.request.content.data?.type === "order") {
				// 	redirect(response?.notification);
				// }
			});

		Notifications.getLastNotificationResponseAsync().then((response) => {
			if (!response?.notification) {
				return;
			}
			redirect(response?.notification);
		});

		return () => {
			notificationListener.current &&
				Notifications.removeNotificationSubscription(
					notificationListener.current
				);
			responseListener.current &&
				Notifications.removeNotificationSubscription(responseListener.current);
		};
	}, []);

	useEffect(() => {
		if (expoPushToken !== "") {
			getCredentials()
				.then(async (credentials: any) => {
					await ApiInstance.put(
						"/api/save-token",
						{
							pushToken: expoPushToken,
						},
						{
							headers: {
								// @ts-ignore
								"auth-token": credentials.accessToken,
							},
						}
					);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [expoPushToken]);

	function redirect(notification: Notifications.Notification) {
		const url = notification.request.content.data?.url;
		if (url) {
			router.push(url);
		}
	}

	async function registerForPushNotificationsAsync() {
		if (Platform.OS === "android") {
			Notifications.setNotificationChannelAsync("default", {
				name: "default",
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: "#FF231F7C",
			});
		}

		if (Device.isDevice) {
			const { status: existingStatus } =
				await Notifications.getPermissionsAsync();
			let finalStatus = existingStatus;

			if (existingStatus !== "granted") {
				const { status } = await Notifications.requestPermissionsAsync();
				finalStatus = status;
			}

			if (finalStatus !== "granted") {
				throw new Error(
					"Permission not granted to get push token for push notification!"
				);
			}

			const projectId =
				Constants?.expoConfig?.extra?.eas?.projectId ??
				Constants?.easConfig?.projectId;

			if (!projectId) {
				throw new Error("Project ID not found");
			}

			try {
				const pushTokenString = (
					await Notifications.getExpoPushTokenAsync({
						projectId,
					})
				).data;

				return pushTokenString;
			} catch (e) {
				throw e;
			}
		} else {
			throw new Error("Must use physical device for push notifications");
		}
	}
}
