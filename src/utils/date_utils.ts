export class DateUtils {

    /**format example: 2023-09-01*/
    static ISOStringDate(date: Date) {
        return date.toISOString().slice(0, 10)
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

}
