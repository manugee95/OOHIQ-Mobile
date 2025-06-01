import { create } from "zustand";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { AvailableLocation, Upload } from "@/src/types";
import React from "react";

type BottomSheetRef = React.RefObject<BottomSheetModal> | null;

type UploadsStore = {
	auditToEvaluate: Upload | null;
	setAuditToEvaluate: (val: Upload | null) => void;

	auditToReupload: AvailableLocation | null;
	setAuditToReupload: (val: AvailableLocation | null) => void;

	roadTypeRef: BottomSheetRef;
	setRoadTypeRef: (val: BottomSheetRef) => void;

	vehicularTrafficRef: BottomSheetRef;
	setVehicularTrafficRef: (val: BottomSheetRef) => void;

	pedestrianTrafficRef: BottomSheetRef;
	setPedestrianTrafficRef: (val: BottomSheetRef) => void;

	distanceOfVisibilityRef: BottomSheetRef;
	setDistanceOfVisibilityRef: (val: BottomSheetRef) => void;

	boardPositioningRef: BottomSheetRef;
	setBoardPositioningRef: (val: BottomSheetRef) => void;

	boardLevelRef: BottomSheetRef;
	setBoardLevelRef: (val: BottomSheetRef) => void;

	visibilityPointsRef: BottomSheetRef;
	setVisibilityPointsRef: (val: BottomSheetRef) => void;

	specialFeaturesRef: BottomSheetRef;
	setSpecialFeaturesRef: (val: BottomSheetRef) => void;

	noOfBoardsInViewRef: BottomSheetRef;
	setNoOfBoardsInViewRef: (val: BottomSheetRef) => void;

	noOfCompetitiveBoardsRef: BottomSheetRef;
	setNoOfCompetitiveBoardsRef: (val: BottomSheetRef) => void;

	noOfLargerBoardsRef: BottomSheetRef;
	setNoOfLargerBoardsRef: (val: BottomSheetRef) => void;

	competitiveBoardTypesRef: BottomSheetRef;
	setCompetitiveBoardTypesRef: (val: BottomSheetRef) => void;
};

const UploadsStore = create<UploadsStore>()((set) => ({
	auditToEvaluate: null,
	setAuditToEvaluate: (val) =>
		set((state) => ({ ...state, auditToEvaluate: val })),

	auditToReupload: null,
	setAuditToReupload: (val) =>
		set((state) => ({ ...state, auditToReupload: val })),

	roadTypeRef: null,
	setRoadTypeRef: (val) => set((state) => ({ ...state, roadTypeRef: val })),

	vehicularTrafficRef: null,
	setVehicularTrafficRef: (val) =>
		set((state) => ({ ...state, vehicularTrafficRef: val })),

	pedestrianTrafficRef: null,
	setPedestrianTrafficRef: (val) =>
		set((state) => ({ ...state, pedestrianTrafficRef: val })),

	distanceOfVisibilityRef: null,
	setDistanceOfVisibilityRef: (val) =>
		set((state) => ({ ...state, distanceOfVisibilityRef: val })),

	boardPositioningRef: null,
	setBoardPositioningRef: (val) =>
		set((state) => ({ ...state, boardPositioningRef: val })),

	boardLevelRef: null,
	setBoardLevelRef: (val) => set((state) => ({ ...state, boardLevelRef: val })),

	visibilityPointsRef: null,
	setVisibilityPointsRef: (val) =>
		set((state) => ({ ...state, visibilityPointsRef: val })),

	specialFeaturesRef: null,
	setSpecialFeaturesRef: (val) =>
		set((state) => ({ ...state, specialFeaturesRef: val })),

	noOfBoardsInViewRef: null,
	setNoOfBoardsInViewRef: (val) =>
		set((state) => ({ ...state, noOfBoardsInViewRef: val })),

	noOfCompetitiveBoardsRef: null,
	setNoOfCompetitiveBoardsRef: (val) =>
		set((state) => ({ ...state, noOfCompetitiveBoardsRef: val })),

	noOfLargerBoardsRef: null,
	setNoOfLargerBoardsRef: (val) =>
		set((state) => ({ ...state, noOfLargerBoardsRef: val })),

	competitiveBoardTypesRef: null,
	setCompetitiveBoardTypesRef: (val) =>
		set((state) => ({ ...state, competitiveBoardTypesRef: val })),
}));

const useUploadsStore = () => UploadsStore((state) => state);

export default useUploadsStore;
