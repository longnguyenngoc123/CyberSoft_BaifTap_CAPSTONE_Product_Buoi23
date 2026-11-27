class CartItem {
  constructor(product, quantity = 1) {
    this.product = product;
    this.quantity = quantity;
  }

  calcTotal() {
    return Number(this.product.price) * this.quantity;
  }
}

export default CartItem;