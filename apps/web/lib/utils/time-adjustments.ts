export function formatTime(date: Date) {
	const hours = new Date(date).getHours().toString().padStart(2, '0');
	const minutes = new Date(date).getMinutes().toString().padStart(2, '0');
	const day = new Date(date).getDate();
	const month = new Date(date).getMonth() + 1;
	const year = new Date(date).getFullYear();
	return `${hours}:${minutes} | ${day}.${month}. ${year}`;
}
