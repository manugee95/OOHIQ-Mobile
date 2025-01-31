import React, { useMemo, useCallback, PropsWithChildren } from "react";
import {
	BottomSheetModal,
	BottomSheetBackdrop,
	BottomSheetModalProvider,
	BottomSheetBackdropProps,
	BottomSheetHandleProps,
} from "@gorhom/bottom-sheet";

type BottomSheet = PropsWithChildren & {
	sheetRef: React.RefObject<BottomSheetModal> | null;
	snapPoints: Array<string | number>;
	useBackdrop?: boolean;
	snapIndex?: number;
	canClose?: boolean;
	detached?: boolean;
	bottomInset?: number;
	handleComponent?: React.FC<BottomSheetHandleProps>;
	onDismiss?: () => void;
};

export default function BottomSheet({
	children,
	sheetRef,
	snapPoints,
	useBackdrop = false,
	snapIndex = 1,
	canClose = false,
	handleComponent,
	onDismiss = () => null,
	detached = false,
	bottomInset = 0,
}: BottomSheet) {
	const snapPointsD = useMemo(() => snapPoints, []);

	const renderBackdrop = useCallback(
		(props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				opacity={0.1}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
			/>
		),
		[]
	);

	return (
		<BottomSheetModalProvider>
			<BottomSheetModal
				style={{
					borderRadius: 20,
					overflow: "hidden",
					marginHorizontal: detached ? 20 : 0,
				}}
				handleComponent={handleComponent ? handleComponent : undefined}
				backdropComponent={useBackdrop ? renderBackdrop : () => null}
				ref={sheetRef}
				snapPoints={snapPointsD}
				index={snapIndex}
				enablePanDownToClose={canClose}
				detached={detached}
				bottomInset={bottomInset}
				stackBehavior="replace"
				onDismiss={() => onDismiss()}>
				{children}
			</BottomSheetModal>
		</BottomSheetModalProvider>
	);
}
