import axios from "axios";

const ApiInstance = axios.create({
	baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
});

ApiInstance.interceptors.request.use(
	async function (config) {
		const timestamp = Date.now();

		// Check if URL already has query params
		if (config.url?.includes("?")) {
			config.url += `&timestamp=${timestamp}`;
		} else {
			config.url += `?timestamp=${timestamp}`;
		}

		return config;
	},
	function (error) {
		// Do something with request error
		return Promise.reject(error);
	}
);

export default ApiInstance;
