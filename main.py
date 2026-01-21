# Create a function to calculate total price with tax
def calculate_total_price_with_tax(price, tax_rate):
    total = price + (price * tax_rate)
    return total