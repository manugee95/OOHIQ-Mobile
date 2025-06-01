import React from "react";
import NewAuditScreen from "../new-audit/NewAuditScreen";
import { useSearchParams } from "expo-router/build/hooks";
import useUploadsStore from "@/src/hooks/stores/useUploadsStore";

export default function UploadReauditScreen() {
	const { auditToReupload } = useUploadsStore();

	return (
		<NewAuditScreen
			isReaudit={true}
			currentLocationStr={auditToReupload?.audit.location}
			reAuditID={auditToReupload?.id}
			latitude={Number(auditToReupload?.audit.geolocation[0].latitude)}
			longitude={Number(auditToReupload?.audit.geolocation[0].longitude)}
		/>
	);
}
