export const toTitleCase = (text: string | undefined) => {
    if (text !== undefined) {
        return text.replace(/\b\w/g, (char) => char.toUpperCase())
    } else {
        return '';
    }
}




export const normalizeDate = (date: string, short: boolean) => {

    let year, month, day;

    if (date !== 'TBD') {

        if (date.indexOf('/') > -1) {
            const dateArr = date.split('/');
            month = dateArr[0];
            day = dateArr[1];
            year = dateArr[2];

        } else if (date.indexOf('T') > -1) {
            date = date.split('T')[0];

        } else {
            const dateArr = date.split('-');
            year = dateArr[0];
            month = dateArr[1];
            day = dateArr[2];
        }

        const months = "0 January February March April May June July August September October November December".split(' ');
        if (day[0] === '0') {
            day = day[1];
        }
        month = months[Number(month)];
        if (short) {
            month = month.slice(0, 3);
            return `${month} ${day}`;
        }
        return `${month} ${day}, ${year}`;

    } else {
        return date;
    }
}
