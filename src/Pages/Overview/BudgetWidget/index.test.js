import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BudgetWidget from './BudgetWidget';
import { useUtilities } from '../../../App/Context/utilities';

jest.mock('../../../App/Context/utilities'); // Mockear useUtilities

describe('BudgetWidget Component', () => {
    const mockFormatMoney = jest.fn((value) => `$${value}`);
    const mockFormatPercent = jest.fn((value) => `${value}%`);

    beforeEach(() => {
        useUtilities.mockReturnValue({
            formatMoney: mockFormatMoney,
            formatPercent: mockFormatPercent
        });
    });

    it('renders without crashing', () => {
        const { getByText } = render(<BudgetWidget currentBudget={null} />);
        expect(getByText('No data available')).toBeInTheDocument();
    });

    it('displays the budget when provided', () => {
        const currentBudget = { total: 1000, variation: 5, month: 6 };
        const { getByText } = render(<BudgetWidget currentBudget={currentBudget} />);

        expect(getByText('Budget')).toBeInTheDocument();
        expect(mockFormatMoney).toHaveBeenCalledWith(1000);
        expect(mockFormatPercent).toHaveBeenCalledWith(5);
        expect(getByText('$1000')).toBeInTheDocument();
        expect(getByText('5%')).toBeInTheDocument();
    });

    it('applies the correct class based on variation', () => {
        const { getByText, rerender } = render(<BudgetWidget currentBudget={{ total: 1000, variation: -10, month: 6 }} />);
        expect(getByText('-10%').closest('span')).toHaveClass('text-success');

        rerender(<BudgetWidget currentBudget={{ total: 1000, variation: 10, month: 6 }} />);
        expect(getByText('10%').closest('span')).toHaveClass('text-danger');
    });
});