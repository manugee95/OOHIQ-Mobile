import React from "react";
import Rookie from "@/src/assets/images/Rookie.svg";
import Challenger from "@/src/assets/images/Challenger.svg";
import Contender from "@/src/assets/images/Contender.svg";
import Professional from "@/src/assets/images/Professional.svg";
import Ultimate from "@/src/assets/images/Ultimate.svg";
import { SvgProps } from "react-native-svg";

export const levels: { [key: string]: React.FC<SvgProps> } = {
	Rookie,
	Challenger,
	Professional,
	Ultimate,
	Contender,
};
