function calculateTotalPriceWithTax(price, taxRate) {
    const total = price + (price * taxRate);
    return total;
}