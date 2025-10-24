export type ToastArgs = {
	title: string;
	content: string;
	variant: 'success' | 'information' | 'error';
};

export type ToastArgsWithId = ToastArgs & {
	id: string;
};
type Listener = (toast: ToastArgsWithId) => void;
const listeners = new Set<Listener>();

export function toast(message: ToastArgs) {
	for (const l of listeners) {
		l({ ...message, id: Math.random().toString(36).slice(2) });
	}
}

export function subscribe(listener: Listener) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}
