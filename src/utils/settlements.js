const EPSILON = 0.01;

export function computeSettlements(balances) {
    const creditors = balances
        .filter((member) => member.balance > EPSILON)
        .map((member) => ({ uid: member.uid, amount: member.balance }))
        .sort((a, b) => b.amount - a.amount);
    const debtors = balances
        .filter((member) => member.balance < -EPSILON)
        .map((member) => ({ uid: member.uid, amount: -member.balance }))
        .sort((a, b) => b.amount - a.amount);

    const settlements = [];
    let i = 0;
    let j = 0;
    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];
        const amount = Math.min(debtor.amount, creditor.amount);
        if (amount > EPSILON) {
            settlements.push({ from: debtor.uid, to: creditor.uid, amount });
        }
        debtor.amount -= amount;
        creditor.amount -= amount;
        if (debtor.amount <= EPSILON) i++;
        if (creditor.amount <= EPSILON) j++;
    }
    return settlements;
}
