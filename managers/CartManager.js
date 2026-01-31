import fs from 'fs';
// en este proyecto, los carritos representan pedidos o presupuestos


export default class CartManager {
  constructor(path) {
    this.path = path;
  }




  async getCarts() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async createCart() {
    const carts = await this.getCarts();
//aca hacemos que se genere un id creciente

    const newId =
      carts.length === 0
        ? 1
        : Number(carts[carts.length - 1].id) + 1;

    const newCart = {
      id: newId,
      products: []
    };

    carts.push(newCart);

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(carts, null, 2)
    );

    return newCart;
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find(c => c.id === Number(id));
  }

  async addProductToCart(cid, pid) {
    const carts = await this.getCarts();
    const cartIndex = carts.findIndex(c => c.id === Number(cid));

    if (cartIndex === -1) return null;

    const products = carts[cartIndex].products;

    const productIndex = products.findIndex(
      p => p.product === Number(pid)
    );

    if (productIndex === -1) {
      products.push({
        product: Number(pid),
        quantity: 1
      });
    } else {
      products[productIndex].quantity += 1;
    }

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(carts, null, 2)
    );

    return carts[cartIndex];
  }
}
