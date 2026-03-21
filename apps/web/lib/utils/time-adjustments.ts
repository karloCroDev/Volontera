export function formatTime(date: Date) {
	const hours = new Date(date).getHours().toString().padStart(2, '0');
	const minutes = new Date(date).getMinutes().toString().padStart(2, '0');
	const day = new Date(date).getDate();
	const month = new Date(date).getMonth() + 1;
	const year = new Date(date).getFullYear();
	return `${hours}:${minutes} | ${day}.${month}. ${year}`;
}

export function formatDate(dateString: string) {
	const date = new Date(dateString);

	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear().toString();

	return `${day}. ${month}. ${year}.`;
}

export function formatIntervalTime(date: Date | string) {
	const d = new Date(date);
	return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
