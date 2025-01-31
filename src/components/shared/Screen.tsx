import React, { PropsWithChildren } from "react";
import { View } from "react-native";

type Props = PropsWithChildren;

export default function Screen({ children }: Props) {
	return <View style={{ flex: 1 }}>{children}</View>;
}
