import { createState, reducer, toValue } from "./reducer";

const bounds = { min: 0, max: Infinity };

describe("toValue", () => {
    test("parses dot and comma decimals", () => {
        expect(toValue("1.5", bounds)).toBe(1.5);
        expect(toValue("1,5", bounds)).toBe(1.5);
    });

    test("treats empty and incomplete text as zero", () => {
        expect(toValue("", bounds)).toBe(0);
        expect(toValue(".", bounds)).toBe(0);
        expect(toValue("1.", bounds)).toBe(1);
    });

    test("clamps to the bounds", () => {
        expect(toValue("15", { min: 0, max: 10 })).toBe(10);
        expect(toValue("", { min: 2, max: 10 })).toBe(2);
    });
});

describe("createState", () => {
    test("builds the text from a number or numeric string", () => {
        expect(createState(3, bounds)).toEqual({ text: "3" });
        expect(createState("2.5", bounds)).toEqual({ text: "2.5" });
    });

    test("falls back to zero for invalid values and clamps", () => {
        expect(createState(null, bounds)).toEqual({ text: "0" });
        expect(createState(undefined, bounds)).toEqual({ text: "0" });
        expect(createState(50, { min: 0, max: 10 })).toEqual({ text: "10" });
    });
});

describe("reducer: type", () => {
    const type = (text, from = "0") => reducer({ text: from }, { type: "type", text, ...bounds });

    test("keeps in-progress decimals such as '1.' and '1.0'", () => {
        expect(type("1.").text).toBe("1.");
        expect(type("1.0", "1.").text).toBe("1.0");
        expect(type("1.05", "1.0").text).toBe("1.05");
    });

    test("accepts a comma as decimal separator", () => {
        expect(type("1,5").text).toBe("1,5");
    });

    test("allows clearing the field", () => {
        expect(type("", "5").text).toBe("");
    });

    test("ignores invalid input", () => {
        const state = { text: "5" };
        expect(reducer(state, { type: "type", text: "5a", ...bounds })).toBe(state);
        expect(reducer(state, { type: "type", text: "1.2.3", ...bounds })).toBe(state);
        expect(reducer(state, { type: "type", text: "-5", ...bounds })).toBe(state);
    });

    test("strips leading zeros but keeps '0.5'", () => {
        expect(type("05").text).toBe("5");
        expect(type("007").text).toBe("7");
        expect(type("0.5").text).toBe("0.5");
        expect(type("00").text).toBe("0");
    });
});

describe("reducer: step", () => {
    const step = (text, direction, extra = {}) =>
        reducer({ text }, { type: "step", direction, step: 1, ...bounds, ...extra }).text;

    test("increases and decreases by the step", () => {
        expect(step("10", 1)).toBe("11");
        expect(step("10", -1)).toBe("9");
    });

    test("steps from an in-progress decimal instead of concatenating text", () => {
        expect(step("1.", 1)).toBe("2");
    });

    test("does not go below the minimum, even for fractions", () => {
        expect(step("0", -1)).toBe("0");
        expect(step("0.5", -1)).toBe("0");
    });

    test("does not go above the maximum", () => {
        expect(step("10", 1, { max: 10 })).toBe("10");
    });

    test("keeps existing decimals when stepping by whole numbers", () => {
        expect(step("1.25", 1)).toBe("2.25");
    });

    test("avoids floating point drift with decimal steps", () => {
        expect(step("0.2", 1, { step: 0.1 })).toBe("0.3");
    });

    test("steps from an empty field as zero", () => {
        expect(step("", 1)).toBe("1");
    });

    test("returns the same state when nothing changes", () => {
        const state = { text: "0" };
        expect(reducer(state, { type: "step", direction: -1, step: 1, ...bounds })).toBe(state);
    });
});

describe("reducer: commit", () => {
    const commit = (text, extra = {}) => reducer({ text }, { type: "commit", ...bounds, ...extra }).text;

    test("normalizes empty and incomplete text", () => {
        expect(commit("")).toBe("0");
        expect(commit("1.")).toBe("1");
        expect(commit("05")).toBe("5");
    });

    test("normalizes a comma to a dot", () => {
        expect(commit("1,50")).toBe("1.5");
    });

    test("clamps to the bounds", () => {
        expect(commit("15", { max: 10 })).toBe("10");
        expect(commit("", { min: 1 })).toBe("1");
    });

    test("returns the same state when already normalized", () => {
        const state = { text: "5" };
        expect(reducer(state, { type: "commit", ...bounds })).toBe(state);
    });
});

describe("reducer: sync", () => {
    const sync = (state, value, extra = {}) => reducer(state, { type: "sync", value, ...bounds, ...extra });

    test("keeps the text being typed when it already represents the value", () => {
        const state = { text: "1." };
        expect(sync(state, 1)).toBe(state);
    });

    test("replaces the text when the value changes from outside", () => {
        expect(sync({ text: "3" }, 7).text).toBe("7");
    });

    test("clamps out-of-range values", () => {
        expect(sync({ text: "3" }, 50, { max: 10 }).text).toBe("10");
    });
});
