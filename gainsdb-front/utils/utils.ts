import { WorkoutsObj } from "@/app/types/types";


export const toTitleCase = (text: string | undefined) => {
    if (text !== undefined) {
        return text.replace(/\b\w/g, (char) => char.toUpperCase())
    } else {
        return '';
    }
}


export const normalizeDate = (date: string, short: boolean) => {

    let year: string, month: string, day: string;

    if (date !== 'TBD') {

        if (date.indexOf('/') > -1) {
            const dateArr = date.split('/');
            month = dateArr[0];
            day = dateArr[1];
            year = dateArr[2];


        } else {
            if (date.indexOf('T') > -1) date = date.split('T')[0];
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




export const HRTime = (value: string) => {
    switch (value) {
        case "1w": return "1 week";
        case "2w": return "2 weeks";
        case "3w": return "3 weeks";
        case "4w": return "4 weeks";
        case "5w": return "5 weeks";
        case "6w": return "6 weeks";
    }
}




export const applyCategoryFilter = (category: string, data: WorkoutsObj | undefined): WorkoutsObj | undefined => {
    if (!data || !data.dates) return;

    console.log("Filtering workouts by category:", category);

    const filteredWorkoutsObj: WorkoutsObj = { dates: [] };

    for (const date of data.dates) {
        const workout = data[date];

        if (!workout || !("exercises" in workout)) continue;

        for (const exe of workout.exercises) {
            if (exe.includes(category)) {
                if (!filteredWorkoutsObj.dates.includes(date)) {
                    filteredWorkoutsObj.dates.push(date);
                    filteredWorkoutsObj[date] = workout;
                }
            }
        }
    }

    console.log("Filtered workouts:", filteredWorkoutsObj);
    return filteredWorkoutsObj;
};
