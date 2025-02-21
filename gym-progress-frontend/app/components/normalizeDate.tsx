const normalizeDate = (date: string, short: boolean) => {
  if (date !== 'TBD') {
    if (date.indexOf('T') > -1) {
      date = date.split('T')[0];
    }
    const dateArr = date.split('-');
    let year = dateArr[0];
    let month = dateArr[1];
    let day = dateArr[2];
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
export default normalizeDate;