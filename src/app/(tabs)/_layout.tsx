import React from "react";
import { Tabs } from "expo-router";
import TabBar from "@/src/components/shared/TabBar";

export default function _layout() {
	return (
		<Tabs
			screenOptions={{ headerShown: false }}
			tabBar={(props) => <TabBar {...props} />}>
			<Tabs.Screen name="dashboard" options={{ tabBarLabel: "Dashboard" }} />
			<Tabs.Screen name="wallet" options={{ tabBarLabel: "Wallet" }} />
			<Tabs.Screen name="account" options={{ tabBarLabel: "Account" }} />
		</Tabs>
	);
}
