import React, { useCallback, useState } from "react";
import { View } from "react-native";
import ApiInstance from "@/src/utils/api-instance";
import { useQuery } from "@tanstack/react-query";
import useToast from "@/src/hooks/useToast";
import useCredentials from "@/src/hooks/useCredentials";
import Loader from "@/src/components/shared/Loader";
import { LatLngLiteral } from "@googlemaps/google-maps-services-js";
import {
	getCurrentPositionAsync,
	getForegroundPermissionsAsync,
	LocationAccuracy,
	requestForegroundPermissionsAsync,
} from "expo-location";
import { googleMapClient } from "@/src/utils/google-loader";
import { useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { FlashList } from "@shopify/flash-list";
import AvailableLocationCard from "./AvailableLocationCard";
import { AvailableLocation } from "@/src/types";
import NoData from "@/src/assets/images/NoData.svg";
import AppText from "@/src/components/shared/AppText";
import Slider from "@react-native-community/slider";

export default function AvailableLocationsScreen() {
	const { getCredentials } = useCredentials();
	const showAndHideToast = useToast();
	const [coords, setCoords] = useState<LatLngLiteral | null>(null);
	const [isGettingLocation, setIsGettingLocation] = useState(true);
	const [range, setRange] = useState(10);

	useFocusEffect(
		useCallback(() => {
			getForegroundPermissionsAsync().then(async (val) => {
				if (val.granted) {
					getCurrentLocation();
				} else {
					requestForegroundPermissionsAsync().then(async (val) => {
						if (val.granted) {
							getCurrentLocation();
						} else {
							showAndHideToast("Location access Permission denied", "error");
						}
					});
				}
			});
		}, [])
	);

	function getCurrentLocation() {
		getCurrentPositionAsync({
			accuracy: LocationAccuracy.Highest,
		}).then(async ({ coords }) => {
			setCoords({ lat: coords.latitude, lng: coords.longitude });
			setIsGettingLocation(false);
		});
	}

	const { data, isLoading, error, refetch, isRefetching, isFetching } =
		useQuery({
			queryKey: ["available-locations", coords, range],
			queryFn: async () => {
				const credentials = await getCredentials();

				const res = await ApiInstance.get(
					`/api/get-available-audits?lat=${coords?.lat}&lng=${coords?.lng}&range=${range}`,
					{
						headers: {
							// @ts-ignore
							"auth-token": credentials.accessToken,
						},
					}
				);

				return res.data;
			},
			enabled: coords !== null,
		});

	console.log(coords, error, data);

	if (isGettingLocation) {
		return <Loader />;
	}

	return (
		<View className="flex-1 bg-white px-[15px] pb-[15px]">
			<FlashList
				onRefresh={async () => {
					await refetch();
				}}
				refreshing={isRefetching && !isLoading}
				data={isLoading || isFetching ? [1, 2, 3, 4] : data?.reaudits}
				renderItem={({ item }: { item: AvailableLocation }) => {
					if (isLoading || isFetching) {
						return (
							<View className="w-full h-[120px] bg-[#d3d3d3] mb-[10px] rounded-2xl"></View>
						);
					} else {
						return <AvailableLocationCard item={item} />;
					}
				}}
				estimatedItemSize={150}
				ListHeaderComponent={
					<View className="gap-[2px] pt-[10px] pb-[20px]">
						<View className="flex-row items-center justify-between">
							<AppText weight="SemiBold">1km</AppText>
							<AppText weight="SemiBold">50km</AppText>
						</View>
						<Slider
							style={{ padding: 0, margin: 0 }}
							minimumValue={1}
							maximumValue={50}
							value={range}
							thumbTintColor="#00100A"
							minimumTrackTintColor="#00100A"
							StepMarker={({ stepMarked, currentValue }) => {
								if (!stepMarked) {
									return undefined;
								}
								return (
									<View className="absolute top-[-20px]">
										<AppText>{currentValue}km</AppText>
									</View>
								);
							}}
							step={1}
							onValueChange={(val) => {
								setRange(val);
							}}
						/>
					</View>
				}
				ListEmptyComponent={
					<View className="flex-1 bg-white p-[10px] items-center justify-center">
						<NoData width={300} height={300} />
						<AppText className="text-[15px]">
							No Locations available at this time.
						</AppText>
					</View>
				}
			/>
		</View>
	);
}
