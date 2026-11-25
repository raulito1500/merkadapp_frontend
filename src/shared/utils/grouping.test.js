import { mergeMonthlySeries } from "./grouping";

describe("mergeMonthlySeries", () => {
    it("aligns series on the union of months and fills gaps with 0", () => {
        const bills = [
            { date: "2026-09-01T05:00:00Z", total: 100 },
            { date: "2026-10-01T05:00:00Z", total: 200 },
        ];
        const expenses = [
            { date: "2026-10-01T05:00:00Z", total: 50 },
            { date: "2026-11-01T05:00:00Z", total: 70 },
        ];

        expect(mergeMonthlySeries([bills, expenses])).toEqual({
            months: ["2026-09", "2026-10", "2026-11"],
            series: [
                [100, 200, 0],
                [0, 50, 70],
            ],
        });
    });

    it("returns empty buckets when there is no data", () => {
        expect(mergeMonthlySeries([[], []])).toEqual({ months: [], series: [[], []] });
    });
});
