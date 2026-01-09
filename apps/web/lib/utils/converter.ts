export function convertToFullname({
	firstname,
	lastname,
}: {
	firstname: string;
	lastname: string;
}) {
	return `${firstname} ${lastname}`;
}

export function convertToPascalCase(str: string) {
	return str
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
}

export function convertCalendarDate({
	day,
	month,
	year,
}: {
	year: number;
	month: number;
	day: number;
}) {
	return `${String(year).padStart(2, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
