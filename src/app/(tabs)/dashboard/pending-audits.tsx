import React from "react";
import Screen from "@/src/components/shared/Screen";
import PendingAuditsScreen from "@/src/components/screens/dashboard/pending-audits/PendingAuditsScreen";

export default function pendingaudits() {
	return (
		<Screen>
			<PendingAuditsScreen />
		</Screen>
	);
}
