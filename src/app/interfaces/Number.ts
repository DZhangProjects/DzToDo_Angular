export { }                          //https://www.oodlestechnologies.com/blogs/Extending-Native-JavaScript-Prototypes-In-Angular/


declare global {                    //https://stackoverflow.com/questions/39877156/how-to-extend-string-prototype-and-use-it-next-in-typescript
    interface Number {
        toOrdinal(): string;
    }
}


// Converts number to an ordinal string              //https://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
Number.prototype.toOrdinal = function () {
    if (this > 3 && this < 21) {
        return String(this) + 'th';
    } else {
        const nStr: String = String(this).slice(-1);
        switch (nStr) {
            case "1":
                return String(this) + 'st';
            case "2":
                return String(this) + 'nd';
            default:
                return String(this) + 'th';
        }
    }
};