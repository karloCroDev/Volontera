export type ToastArgs = {
	title: string;
	content: string;
	variant: 'success' | 'information' | 'error';
};

type Listener = (toast: ToastArgs) => void;
const listeners = new Set<Listener>();

export function toast(message: ToastArgs) {
	for (const l of listeners) {
		l(message);
	}
}

export function subscribe(listener: Listener) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}
