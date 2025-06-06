import NewAuditScreen from "@/src/components/screens/dashboard/new-audit/NewAuditScreen";
import Screen from "@/src/components/shared/Screen";
import React from "react";

export default function newaudit() {
	return (
		<Screen>
			<NewAuditScreen isReaudit={false} />
		</Screen>
	);
}
