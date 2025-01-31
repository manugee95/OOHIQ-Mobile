import * as FileSystem from "expo-file-system";

export async function RequestWithFileUpload(
	url: string,
	fileURL: string,
	options: FileSystem.FileSystemUploadOptions
) {
	const response = await FileSystem.uploadAsync(url, fileURL, options);

	console.log(response.body);

	if (response.status !== 200 && response.status !== 201) {
		let responseData;

		try {
			responseData = JSON.parse(response.body);
		} catch (error) {
			throw new Error("An error occurred");
		}

		const error = new Error(responseData.message);

		throw error;
	}

	let res = response.body;

	try {
		res = JSON.parse(response.body);
	} catch (error) {
		res = response.body;
	}

	return res;
}
