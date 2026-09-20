const TEXT_PATTERN = /^\d*[.,]?\d*$/;

function toNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
}

function clamp(number, min, max) {
    return Math.min(Math.max(number, min), max);
}

function parseText(text) {
    const number = parseFloat(String(text).replace(",", "."));
    return Number.isNaN(number) ? 0 : number;
}

function decimalsOf(number) {
    return (String(number).split(".")[1] || "").length;
}

function toValue(text, { min, max }) {
    return clamp(parseText(text), min, max);
}

function createState(value, { min, max }) {
    return { text: String(clamp(toNumber(value), min, max)) };
}

function withText(state, text) {
    return text === state.text ? state : { text };
}

function reducer(state, action) {
    const { min, max } = action;

    switch (action.type) {
        case "type": {
            if (!TEXT_PATTERN.test(action.text)) return state;
            return withText(state, action.text.replace(/^0+(?=\d)/, ""));
        }
        case "step": {
            const current = toValue(state.text, action);
            const decimals = Math.max(decimalsOf(action.step), decimalsOf(current));
            const next = clamp(current + action.direction * action.step, min, max);
            return withText(state, String(Number(next.toFixed(decimals))));
        }
        case "commit":
            return withText(state, String(toValue(state.text, action)));
        case "sync": {
            const target = clamp(toNumber(action.value), min, max);
            return toValue(state.text, action) === target ? state : { text: String(target) };
        }
        default:
            return state;
    }
}

export { createState, reducer, toValue };
