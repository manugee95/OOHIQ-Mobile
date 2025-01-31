import { create } from "zustand";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { User } from "@/src/types";

import React from "react";

type BottomSheetRef = React.RefObject<BottomSheetModal> | null;

export interface Alert {
	show?: boolean;
	message: string;
	type: "error" | "success";
}

type RootStore = {
	statusBarStyle: "light" | "dark";
	isAuthenticated: boolean;
	billboardTypeRef: BottomSheetRef;
	userDetails: User | null;
	alert: Alert;
	setAlert: (val: Alert) => void;
	setStatusBarStyle: (val: "light" | "dark") => void;
	setUserDetails: (val: User) => void;
	setIsAuthenticated: (val: boolean) => void;
	setBillboardTypeRef: (val: BottomSheetRef) => void;
};

const RootStore = create<RootStore>()((set) => ({
	statusBarStyle: "dark",
	isAuthenticated: false,
	userDetails: null,
	billboardTypeRef: null,
	alert: {
		show: false,
		message: "",
		type: "success",
	},
	setAlert: (val) => set((state) => ({ ...state, alert: val })),
	setStatusBarStyle: (val) =>
		set((state) => ({ ...state, statusBarStyle: val })),
	setIsAuthenticated: (val) =>
		set((state) => ({
			...state,
			isAuthenticated: val,
		})),
	setBillboardTypeRef: (val) =>
		set((state) => ({ ...state, billboardTypeRef: val })),
	setUserDetails: (val) => set((state) => ({ ...state, userDetails: val })),
}));

const useRootStore = () => RootStore((state) => state);

export default useRootStore;
