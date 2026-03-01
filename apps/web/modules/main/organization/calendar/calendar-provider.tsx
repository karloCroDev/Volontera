'use client';

// External packages
import * as React from 'react';
import {
	getLocalTimeZone,
	today,
	type CalendarDate,
} from '@internationalized/date';

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
	defaultFocusedDate?: CalendarDate;
}> = ({ children, defaultFocusedDate }) => {
	const timeZone = getLocalTimeZone();

	const [focusedDate, setFocusedDate] = React.useState<CalendarDate>(
		() => defaultFocusedDate ?? today(timeZone)
	);

	const prevMonth = React.useCallback(() => {
		setFocusedDate((current) => current.subtract({ months: 1 }));
	}, []);

	const nextMonth = React.useCallback(() => {
		setFocusedDate((current) => current.add({ months: 1 }));
	}, []);

	const monthLabel = React.useMemo(() => {
		const formatter = new Intl.DateTimeFormat('en-US', {
			month: 'long',
			year: 'numeric',
		});
		return formatter.format(focusedDate.toDate(timeZone));
	}, [focusedDate, timeZone]);

	return (
		<CalendarContext.Provider
			value={{
				focusedDate,
				monthLabel,
				nextMonth,
				prevMonth,
				setFocusedDate,
				timeZone,
			}}
		>
			{children}
		</CalendarContext.Provider>
	);
};
