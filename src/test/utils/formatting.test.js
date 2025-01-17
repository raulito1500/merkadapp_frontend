import { formatMoney, formatPercent } from "../../utils/formatting";

describe("Formatting utils", () => {
    test("Format money with zero number", () => {
        const value = 10000;
        const result = formatMoney(value);
        expect(result).toBe("$10.000");
    });
    test("Format percent with zero number", () => {
        const value = 95.67809;
        const result = formatPercent(value);
        expect(result).toBe("95,7%");
    });
});
