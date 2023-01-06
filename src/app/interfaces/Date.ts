export { }                          //https://www.oodlestechnologies.com/blogs/Extending-Native-JavaScript-Prototypes-In-Angular/


declare global {                    //https://stackoverflow.com/questions/39877156/how-to-extend-string-prototype-and-use-it-next-in-typescript
    interface Date {
        isLeapYear(): boolean;
        getDOY(): number;
        getTomorrow(): Date;
        getYesterday(): Date;
        toTomorrow(): void;
        toYesterday(): void;
        getSunday(): Date;
        copy(): Date;
        toMDY(): string;
    }
}


// Checks if Leap Year              //https://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
Date.prototype.isLeapYear = function () {
    var year = this.getFullYear();
    if ((year & 3) != 0) return false;
    return ((year % 100) != 0 || (year % 400) == 0);
};

// Get Day of Year
Date.prototype.getDOY = function () {
    var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var mn = this.getMonth();
    var dn = this.getDate();
    var dayOfYear = dayCount[mn] + dn;
    if (mn > 1 && this.isLeapYear()) dayOfYear++;
    return dayOfYear;
};

// Gets the next day
Date.prototype.getTomorrow = function () {
    const tomorrow: Date = new Date(this.getTime());
    tomorrow.setDate(this.getDate() + 1);
    return tomorrow;
}

// Gets the previous day
Date.prototype.getYesterday = function () {
    const yesterday: Date = new Date(this.getTime());
    yesterday.setDate(this.getDate() - 1);
    return yesterday;
}

// Sets date to the next day
Date.prototype.toTomorrow = function () {
    this.setDate(this.getDate() + 1);
}

// Sets date to the previous day
Date.prototype.toYesterday = function () {
    this.setDate(this.getDate() - 1);
}

// Gets last sunday (or this day if it is a sunday)
Date.prototype.getSunday = function () {
    let sunday: Date = new Date(this.getTime());
    while (sunday.getDay() != 0) {
        console.log("Sunday?", sunday);
        sunday.toYesterday();
    }
    return sunday;
}

// Gets last sunday (or this day if it is a sunday)
Date.prototype.copy = function () {
    return new Date(this.getTime());
}

// Gets last sunday (or this day if it is a sunday)
Date.prototype.toMDY = function () {
    return String(this.getMonth() + 1) + '/' + String(this.getDate()) + '/' + String(this.getFullYear());
}