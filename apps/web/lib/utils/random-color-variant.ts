export const randomColorVariant = <T>(colorVariantsArr: T[]): T => {
	const index = Math.floor(Math.random() * colorVariantsArr.length);
	return colorVariantsArr[index]!;
};
