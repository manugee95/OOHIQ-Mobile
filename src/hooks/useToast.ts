import useRootStore from "./stores/useRootstore";

let timeoutId: NodeJS.Timeout | string | number | undefined;
export default function useToast() {
	const { alert, setAlert } = useRootStore();

	function showAndHideToast(message: string, type: "error" | "success") {
		clearTimeout(timeoutId);
		setAlert({ message, type, show: true });
		timeoutId = setTimeout(() => {
			setAlert({ message, type, show: false });
		}, 5000);
	}

	return showAndHideToast;
}
