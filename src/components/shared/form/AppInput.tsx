import React, { useState } from "react";
import {
	Pressable,
	TextInput,
	StyleSheet,
	KeyboardTypeOptions,
} from "react-native";
import { View } from "react-native";
import AppText from "../AppText";
import Eye from "@/src/assets/images/Eye.svg";
import EyeX from "@/src/assets/images/EyeX.svg";

type Props = {
	label: string;
	placeholder: string;
	errorMessage?: string;
	fullyRounded?: boolean;
	value?: string | number;
	onChange?: (value: string | number) => void;
	keyboardType?: KeyboardTypeOptions;
	className?: string;
	fromStart?: boolean;
};

export default function AppInput({
	label,
	placeholder,
	errorMessage,
	fullyRounded,
	value = "",
	onChange,
	keyboardType = "email-address",
	className,
	fromStart = false,
}: Props) {
	return (
		<View className="w-full gap-y-[10px]">
			<AppText className="text-[16px] text-bgBlack" weight="Medium">
				{label}
			</AppText>
			<TextInput
				className={`bg-[#F5F5F5] h-[50px] p-3 ${
					fullyRounded ? "rounded-full" : "rounded-[10px]"
				} focus:border-primary border-[1.5px] border-transparent text-[15px] placeholder:text-gray-400 ${className}`}
				placeholder={placeholder}
				keyboardType={keyboardType}
				value={String(value)}
				style={styles.input}
				onChangeText={(val) => {
					if (onChange) {
						onChange(val);
					}
				}}
				selection={fromStart ? { start: 0, end: 0 } : undefined}
			/>
			{errorMessage && (
				<AppText className="text-[13px] text-red-500" weight="Regular">
					{errorMessage}
				</AppText>
			)}
		</View>
	);
}

AppInput.ForPassword = ({
	label,
	placeholder,
	errorMessage,
	fullyRounded,
	value = "",
	onChange,
	className,
}: Props) => {
	const [focused, setFocused] = useState(false);
	const [showText, setShowText] = useState(false);

	return (
		<View className="w-full gap-y-[10px]">
			<AppText className="text-[16px] text-textBlack" weight="Medium">
				{label}
			</AppText>
			<View
				className={`bg-[#F5F5F5] h-[50px] flex-row items-center ${
					fullyRounded ? "rounded-full" : "rounded-[10px]"
				}  border-[1.5px] ${
					focused ? "border-primary" : "border-transparent"
				} ${className}`}>
				<TextInput
					className="h-full p-3 text-[15px] grow max-w-[90%] placeholder:text-gray-400"
					placeholder={placeholder}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
					secureTextEntry={!showText ? true : false}
					autoCapitalize="none"
					value={String(value)}
					style={styles.input}
					onChangeText={(val) => {
						if (onChange) {
							onChange(val);
						}
					}}
				/>
				<Pressable
					className="w-[30px] h-full items-center justify-center"
					onPress={() => setShowText(!showText)}>
					{!showText && <Eye fill={"black"} fillOpacity={0.6} />}
					{showText && <EyeX fill={"black"} fillOpacity={0.6} />}
				</Pressable>
			</View>
			{errorMessage && (
				<AppText className="text-[13px] text-red-500" weight="Regular">
					{errorMessage}
				</AppText>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	input: {
		fontFamily: "BarlowRegular",
	},
});
