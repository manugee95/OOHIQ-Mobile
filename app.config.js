module.exports = {
	name: "oohiq",
	slug: "oohiq",
	version: "1.0.0",
	orientation: "portrait",
	icon: "./src/assets/images/icon.png",
	scheme: "oohiq",
	userInterfaceStyle: "automatic",
	splash: {
		image: "./src/assets/images/splash-icon.png",
		resizeMode: "contain",
		backgroundColor: "#ffffff",
	},
	ios: {
		supportsTablet: true,
		infoPlist: {
			NSLocationWhenInUseUsageDescription:
				"Sharing your location allows us to match you with nearby available audits and to also track new audits upload process.",
			UIBackgroundModes: ["remote-notification", "fetch", "location"],
			NSCameraUsageDescription:
				"We need to access your camera to let you upload audit images/video.",
			NSMicrophoneUsageDescription:
				"We need to access your microphone to let you upload audit images/video.",
		},
	},
	android: {
		adaptiveIcon: {
			foregroundImage: "./src/assets/images/adaptive-icon.png",
			backgroundColor: "#ffffff",
		},
		permissions: [
			"android.permission.ACCESS_COARSE_LOCATION",
			"android.permission.ACCESS_FINE_LOCATION",
			"android.permission.ACCESS_BACKGROUND_LOCATION",
			"android.permission.RECORD_AUDIO",
			"android.permission.CAMERA",
			"android.permission.ACCESS_COARSE_LOCATION",
			"android.permission.ACCESS_FINE_LOCATION",
			"android.permission.ACCESS_BACKGROUND_LOCATION",
			"android.permission.RECORD_AUDIO",
			"android.permission.CAMERA",
		],
		package: "com.oohiq.app",
		googleServicesFile:
			process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
	},
	web: {
		bundler: "metro",
		output: "static",
		favicon: "./src/assets/images/favicon.png",
	},
	plugins: [
		"expo-router",
		"expo-secure-store",
		[
			"expo-location",
			{
				locationAlwaysAndWhenInUsePermission:
					"Sharing your location allows us to match you with nearby available audits and to also track new audits upload process.",
			},
		],
		[
			"expo-image-picker",
			{
				photosPermission:
					"We need to access your photos to let you upload your audit images/video.",
				cameraPermission:
					"We need to access your camera to let you upload your audit images/video.",
			},
		],
		[
			"expo-camera",
			{
				cameraPermission:
					"We need to access your camera to let you upload audit images/video.",
				microphonePermission:
					"We need to access your microphone to let you upload audit images/video.",
				recordAudioAndroid: true,
			},
		],
		"expo-video",
		[
			"expo-build-properties",
			{
				android: {
					useLegacyPackaging: true,
					usesCleartextTraffic: true,
				},
			},
		],
		[
			"react-native-vision-camera",
			{
				cameraPermissionText:
					"We need to access your camera to let you upload audit images/video.",
				enableMicrophonePermission: true,
				microphonePermissionText:
					"We need to access your microphone to let you upload audit images/video.",
				enableLocation: true,
				locationPermissionText:
					"Sharing your location allows us to match you with nearby available audits and to also track new audits upload process.",
			},
		],
		[
			"expo-notifications",
			{
				icon: "./src/assets/images/icon.png",
				enableBackgroundRemoteNotifications: true,
			},
		],
	],
	experiments: {
		typedRoutes: true,
	},
	newArchEnabled: false,
	extra: {
		router: {
			origin: false,
		},
		eas: {
			projectId: "8be60353-409b-46b9-b07b-b0d42a17fe56",
		},
	},
	runtimeVersion: {
		policy: "appVersion",
	},
	updates: {
		url: "https://u.expo.dev/8be60353-409b-46b9-b07b-b0d42a17fe56",
	},
};
