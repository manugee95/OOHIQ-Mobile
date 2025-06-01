import React from "react";
import { Tabs } from "expo-router";
import TabBar from "@/src/components/shared/TabBar";
import useNotifications from "@/src/hooks/useNotifications";

export default function _layout() {
	useNotifications();
	return (
		<Tabs
			screenOptions={{ headerShown: false }}
			tabBar={(props) => <TabBar {...props} />}>
			<Tabs.Screen name="dashboard" options={{ tabBarLabel: "Dashboard" }} />
			<Tabs.Screen name="wallet" options={{ tabBarLabel: "Wallet" }} />
			<Tabs.Screen name="uploads" options={{ tabBarLabel: "Uploads" }} />
			<Tabs.Screen name="account" options={{ tabBarLabel: "Account" }} />
		</Tabs>
	);
}
