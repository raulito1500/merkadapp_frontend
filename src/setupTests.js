// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

jest.mock('./App/Context/utilities', () => ({
    useUtilities: () => ({
        formatMoney: jest.fn((value) => `$${value}`),
        formatPercent: jest.fn((value) => `${value}%`)
    })
}));