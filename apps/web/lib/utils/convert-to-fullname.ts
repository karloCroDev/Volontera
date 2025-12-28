export function convertToFullname({
	firstname,
	lastname,
}: {
	firstname: string;
	lastname: string;
}) {
	return `${firstname} ${lastname}`;
}
