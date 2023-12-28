export class DateUtils {

    /**format example: 2023-09-01*/
    static localISOStringDate(date: Date) {
        let timezoneOffsetMs = date.getTimezoneOffset() * 60000;
        let localISODateTime = (new Date(date.valueOf() - timezoneOffsetMs)).toISOString().slice(0, 10);
        return localISODateTime
    }

    /**format example: 1 Sep 2023*/
    static dMMMyyyStringDate(date: Date) {
        return `${date.getDate()} ${date.toLocaleString('en-US', { month: 'short' })} ${date.getFullYear()}`
    }

    /**format example: 01 Sep 2023*/
    static ddMMMyyyStringDate(date: Date) {
        return `${date.toLocaleString('en-US', { day: '2-digit' })} ${date.toLocaleString('en-US', { month: 'short' })} ${date.getFullYear()}`
    }

    static addDaysToNow(daysToAdd: number) {
        return DateUtils.addDaysToDate(new Date(), daysToAdd);
    }

    static addDaysToDate(startingDate: Date, daysToAdd: number) {
        let newDate = new Date(startingDate);
        newDate.setDate(newDate.getDate() + daysToAdd);
        return newDate;
    }

    /**format example: 24/11/2023 */
    static ddmmyyyStringDate(dayToSkip: number) {
        let date = new Date();
        return `${date.getDate() - dayToSkip}/${date.getMonth() + 1}/${date.getFullYear()}`
    }

    static ddmmyyy_StringDate(daysToAdd: number): string {
        const currentDate = new Date();
        const targetDate = new Date(currentDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000); // Add days in milliseconds
        const day = String(targetDate.getDate()).padStart(2, '0');
        const month = String(targetDate.getMonth() + 1).padStart(2, '0');
        const year = String(targetDate.getFullYear());
    
        return `${day}/${month}/${year}`;
    }

}