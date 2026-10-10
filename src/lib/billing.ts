export const calculateTotalInvoice = (baseRate: number, materialCost: number) => {
    return baseRate + materialCost;
};

export const formatCurrency = (amount: number) => {
    return `Rs ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
};
