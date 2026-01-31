import fs from "fs";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }
// busca y devuelve un producto según su id


  async getProductById(id) {
    const products = await this.getProducts();
    return products.find((p) => p.id === id);
  }

  async addProduct(product) {
    const products = await this.getProducts();
    // aca generamos un id creciente
    const newId =
      products.length === 0 ? 1 : Number(products[products.length - 1].id) + 1;

    const newProduct = {
      id: newId,
      title: product.title,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
    };

    products.push(newProduct);

    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));

    return newProduct;
  }
  // aca actualiza un producto segun su id

  
  async updateProduct(id, updatedFields) {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updatedFields,
      id: products[index].id,
    };

    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));

    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const newProducts = products.filter((p) => p.id !== id);

    if (products.length === newProducts.length) return false;

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(newProducts, null, 2),
    );

    return true;
  }
}
