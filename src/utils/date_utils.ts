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
    static ddmmyyyStringDate(dayToAdd: number, age: number = 0) {
        let date = new Date();
        return `${date.getDate() + dayToAdd}/${date.getMonth() + 1}/${date.getFullYear() - age}`
    }


    /**format example: 20240408 */
    static yyyymmddStringDate() {
        let today = new Date();
        const year = today.getFullYear().toString();
        const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const day = today.getDate().toString().padStart(2, '0');

        return year + month + day;
    }

    /** format Example 01-Apr-2024 */

    static ddMMMyyyFormatDate(date: Date) {
        const day = date.toLocaleString('en-US', { day: '2-digit' });
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

}