export interface User {
	email: string;
	fullName: string;
	id: number;
	profilePicture: string;
	role: "FIELD_AUDITOR";
	level: UserLevel;
	auditCount: number;
	task: number;
	walletBalance: number;
	[key: string]: string | number | any;
}

export type UserLevel =
	| "Rookie"
	| "Challenger"
	| "Contender"
	| "Professional"
	| "Ultimate";

export interface Upload {
	advertiserId: number;
	billboardTypeId: number;
	brand: string;
	brandIdentifier: string;
	categoryId: number;
	closeShotUrl: string;
	createdAt: string;
	id: number;
	industryId: number;
	location: string;
	longShotUrl: string;
	status: string;
	updatedAt: string;
	userId: number;
	videoUrl: string;
	geolocation: [{ latitude: string; longitude: string }];
	sovScore: number;
}

export interface AvailableLocation {
	acceptedAt: Date | null;
	acceptedBy: Date | null;
	audit: Upload;
	auditId: number;
	expiresAt: Date | null;
	id: number;
	scheduledFor: Date;
	status: string;
}
