import React from "react";
import {
	ImagePicker,
	HeaderData,
	AlbumData,
	Asset,
} from "@/src/components/shared/ImagePicker";
import { View, Pressable, TouchableOpacity } from "react-native";
import ChevronIcon from "@/src/assets/images/ChevronIcon.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import AppText from "./AppText";

type ImagePickerType = {
	visible: boolean;
	cancel: () => void;
	callback: (assets: Asset[]) => void;
};

export default function CustomImagePicker({
	visible,
	cancel,
	callback,
}: ImagePickerType) {
	return visible ? (
		<ImagePicker
			theme={{
				header: (props) => (
					<CustomImagePickerHeader {...props} cancel={cancel} />
				),
				album: CustomImagePickerAlbum,
			}}
			onSave={(assets) => {
				callback(assets);
				cancel();
			}}
			onCancel={() => {
				cancel();
			}}
			multiple={false}
			albumColumns={1}
			image={true}
		/>
	) : null;
}

const CustomImagePickerHeader = (
	props: HeaderData & { cancel: () => void }
) => {
	const { view, imagesPicked, save, goToAlbum, cancel } = props;
	const { top } = useSafeAreaInsets();

	return (
		<View
			style={{
				paddingTop: top,
				paddingHorizontal: 10,
				height: 100,
				width: "100%",
				backgroundColor: "white",
			}}
			className="flex flex-row items-center justify-between">
			{view == "album" && (
				<>
					<AppText className="text-[20px]" weight="Medium">
						Select an album
					</AppText>
					<Pressable onPress={cancel}>
						<AppText className="text-[15px] text-primary">Cancel</AppText>
					</Pressable>
				</>
			)}

			{view === "gallery" && (
				<>
					<TouchableOpacity
						className="items-center justify-center"
						style={{ width: 35, height: 35 }}
						onPress={goToAlbum}>
						<View style={{ transform: [{ rotate: "90deg" }] }}>
							<ChevronIcon fill={"black"} />
						</View>
					</TouchableOpacity>
					{imagesPicked > 0 && (
						<>
							<AppText className="text-[20px]">{imagesPicked} Selected</AppText>
							<Pressable
								style={{
									width: 80,
									height: 40,
									borderRadius: 5,
								}}
								onPress={save}
								className="bg-primary flex items-center justify-center">
								<AppText className="text-[15px] text-white">Done</AppText>
							</Pressable>
						</>
					)}
				</>
			)}
		</View>
	);
};

const CustomImagePickerAlbum = (props: AlbumData) => {
	const { thumb, album, goToGallery } = props;

	return (
		<TouchableOpacity
			onPress={() => goToGallery(album)}
			style={{ flex: 1, margin: 10, borderRadius: 10, overflow: "hidden" }}>
			<View className="pb-0" style={{ height: 250, width: "100%" }}>
				<Image
					style={{ width: "100%", height: "100%" }}
					source={{ uri: thumb.uri }}
				/>
			</View>
			<View className="p-[10px] bg-white">
				<AppText className="text-[17px] text-primary">{album.title}</AppText>
			</View>
		</TouchableOpacity>
	);
};
