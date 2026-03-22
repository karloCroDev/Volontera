'use client';

// External packages
import * as React from 'react';
import { CalendarDate, getLocalTimeZone } from '@internationalized/date';

// Hooks
import { useSetParams } from '@/hooks/utils/useSetParams';

const CalendarContext = React.createContext<{
	timeZone: string;
	focusedDate: CalendarDate;
	setFocusedDate: React.Dispatch<React.SetStateAction<CalendarDate>>;
	prevMonth: () => void;
	nextMonth: () => void;
	monthLabel: string;
} | null>(null);

export const useCalendarContext = () => {
	const ctx = React.useContext(CalendarContext);
	if (!ctx) {
		throw new Error('useCalendarContext must be used within CalendarProvider');
	}
	return ctx;
};

export const CalendarProvider: React.FC<{
	children: React.ReactNode;
	defaultFocusedDate: {
		year: number;
		month: number;
		day: number;
	};
}> = ({ children, defaultFocusedDate }) => {
	const timeZone = getLocalTimeZone();
	const { searchParams, setParams } = useSetParams();

	const [focusedDate, setFocusedDate] = React.useState<CalendarDate>(
		() =>
			new CalendarDate(
				defaultFocusedDate.year,
				defaultFocusedDate.month,
				defaultFocusedDate.day
			)
	);

	const monthLabel = React.useMemo(() => {
		const formatter = new Intl.DateTimeFormat('en-US', {
			month: 'long',
			year: 'numeric',
		});
		return formatter.format(focusedDate.toDate(timeZone));
	}, [focusedDate, timeZone]);

	React.useEffect(() => {
		const month = String(focusedDate.month);
		const year = String(focusedDate.year);

		if (
			searchParams.get('month') === month &&
			searchParams.get('year') === year
		) {
			return;
		}

		setParams(
			{
				month,
				year,
			},
			{ replace: true }
		);
	}, [focusedDate.month, focusedDate.year, searchParams, setParams]);

	return (
		<CalendarContext.Provider
			value={{
				focusedDate,
				monthLabel,
				nextMonth: () =>
					setFocusedDate((current) => current.add({ months: 1 })),
				prevMonth: () =>
					setFocusedDate((current) => current.subtract({ months: 1 })),
				setFocusedDate,
				timeZone,
			}}
		>
			{children}
		</CalendarContext.Provider>
	);
};
