import { m } from "$lib/paraglide/messages";

export class PlaytimeFormatter {
	static toHoursMinutesSeconds = (playtime: number): string => {
		if (playtime > 0) {
			const totalMins = Math.floor(playtime / 60);
			const secs = playtime % 60;
			const hours = Math.floor(totalMins / 60);
			const mins = totalMins % 60;
			return m["duration.hours_minutes_seconds"]({
				hours: hours,
				mins: mins,
				secs: secs,
			});
		}
		return m["duration.hours_minutes_seconds"]({ hours: 0, mins: 0, secs: 0 });
	};

	static toHoursAndMinutes = (playtime: number): string => {
		if (playtime > 0) {
			const totalMins = Math.floor(playtime / 60);
			const hours = Math.floor(totalMins / 60);
			const mins = totalMins % 60;
			return m["duration.hours_and_minutes"]({ hours: hours, mins: mins });
		}
		return m["duration.hours_and_minutes"]({ hours: 0, mins: 0 });
	};
}
