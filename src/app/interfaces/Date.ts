export { }                          //https://www.oodlestechnologies.com/blogs/Extending-Native-JavaScript-Prototypes-In-Angular/


declare global {                    //https://stackoverflow.com/questions/39877156/how-to-extend-string-prototype-and-use-it-next-in-typescript
    interface Date {
        isLeapYear(): boolean;
        getDOY(): number;
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
