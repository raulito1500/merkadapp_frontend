import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BudgetWidget } from '.';

test('renders no data available when data is empty', () => {
    const { getByText } = render(<BudgetWidget data={[]} />);
    expect(getByText('No data available')).toBeInTheDocument();
});

test('renders budget information when data is provided', () => {
    const data = [
        { total: 1000, date: '2023-09-01' },
        { total: 1500, date: '2023-10-01' }
    ];
    const { getByText } = render(<BudgetWidget data={data} />);

    expect(getByText('$1500')).toBeInTheDocument();
    expect(getByText('50%')).toBeInTheDocument();
});

test('renders budget information with one month provided', () => {
    const data = [
        { total: 1500, date: '2023-10-01' }
    ];
    const { getByText } = render(<BudgetWidget data={data} />);

    expect(getByText('100%')).toBeInTheDocument();
});

test('renders budget information with non-current data provided', () => {
    const data = [
        { total: 1500, date: '2023-09-01' },
        { total: 0, date: '2023-10-01' }
    ];
    const { getByText } = render(<BudgetWidget data={data} />);

    expect(getByText('-100%')).toBeInTheDocument();
});

test('renders budget information when data is zero', () => {
    const data = [
        { total: 0, date: '2023-09-01' },
        { total: 0, date: '2023-10-01' }
    ];
    const { getByText } = render(<BudgetWidget data={data} />);

    expect(getByText('$0')).toBeInTheDocument();
    expect(getByText('0%')).toBeInTheDocument();
    expect(getByText('October')).toBeInTheDocument();
});

test('applies correct CSS class based on positive variation', () => {
    const data = [
        { total: 1000, date: '2023-09-01' },
        { total: 500, date: '2023-10-01' }
    ];
    const { container } = render(<BudgetWidget data={data} />);
    const variationElement = container.querySelector('.text-success');
    expect(variationElement).toBeInTheDocument();
});

test('applies correct CSS class based on negative variation', () => {
    const data = [
        { total: 500, date: '2023-09-01' },
        { total: 1500, date: '2023-10-01' }
    ];
    const { container } = render(<BudgetWidget data={data} />);
    const variationElement = container.querySelector('.text-danger');
    expect(variationElement).toBeInTheDocument();
});

test('applies correct CSS class based on non-variation', () => {
    const data = [
        { total: 0, date: '2023-09-01' },
        { total: 0, date: '2023-10-01' }
    ];
    const { container } = render(<BudgetWidget data={data} />);
    const variationElement = container.querySelector('.text-success');
    expect(variationElement).toBeInTheDocument();
});
