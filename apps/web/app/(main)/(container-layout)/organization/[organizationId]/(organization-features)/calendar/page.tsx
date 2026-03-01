// Modules
import { CalendarGrid } from '@/modules/main/organization/calendar/calendar-grid';
import { DateTracker } from '@/modules/main/organization/calendar/date-tracker';
import { CalendarProvider } from '@/modules/main/organization/calendar/calendar-provider';

export default async function CalendarPage() {
	return (
		<CalendarProvider>
			<div className="mb-6 flex flex-col justify-between gap-x-8 gap-y-4 overflow-x-scroll lg:flex-row lg:items-center">
				<div>
					<h4 className="text-xl lg:text-2xl">Calendar</h4>

					<p className="text-muted-foreground">
						All events that are happening inside this organization
					</p>
				</div>
				<div className="flex justify-between gap-4 lg:justify-start">
					<DateTracker />
				</div>
			</div>

			<div className="flex flex-1">
				<CalendarGrid />
			</div>
		</CalendarProvider>
	);
}
