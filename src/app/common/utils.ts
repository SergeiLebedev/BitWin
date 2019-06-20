export class Utils {

    static selectDistinctPropertyKeys<T>(arrayData: Array<T>, key: string) {
        return arrayData.map(x => x[key]).filter((value, index, self) => self.indexOf(value) === index);
    }

    static compareDate(date1: Date, date2: Date): number {
        const same = date1.getTime() === date2.getTime();
        if (same) { return 0; }
        if (date1 > date2) { return 1; }
        if (date1 < date2) { return -1; }
    }

    static getTranslate(transform) {
        if (typeof transform !== 'undefined' && transform !== null) {
            const translate = transform.replace('translate(', '').replace(')', '').split(',');
            translate[0] = parseFloat(translate[0]);
            translate[1] = parseFloat(translate[1]);
            return translate;
        } else {
            return [0, 0];
        }
    }

    static numberFormatter(input, numberOfDecimals) {
        return parseFloat(input).toLocaleString('EN', { minimumFractionDigits: numberOfDecimals, maximumFractionDigits: numberOfDecimals });
    }

    static getEnumKeyValues(enumType): string[] {
        let values = Object.keys(enumType);
        values = values.slice(values.length / 2);
        return values;
    }
}
