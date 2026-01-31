
import express from 'express';

import ProductManager from './managers/ProductManager.js';
import CartManager from './managers/CartManager.js';

const app = express();

// definimos el puerto donde va a escuchar el servidor
const PORT = 8080;



// middleware para poder leer JSON desde el body de las requests
// sin esto, req.body sería undefined
app.use(express.json());



const productManager = new ProductManager('./data/products.json');


const cartManager = new CartManager('./data/carts.json');



// nod devuelve la lista completa de productos (trabajos disponibles)
app.get('/api/products', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});


// nos devuelve un producto especifico segun su id
app.get('/api/products/:pid', async (req, res) => {
  const { pid } = req.params;

  try {
    const product = await productManager.getProductById(pid);

    // si no existe el producto, nos devuelve un 404
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// crea un nuevo producto (trabajo de herreria)
app.post('/api/products', async (req, res) => {
  const product = req.body;

  
  if (!product || !product.title) {
    return res.status(400).json({ error: 'Datos de producto incompletos' });
  }

  try {
    const newProduct = await productManager.addProduct(product);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// actualiza un producto existente segun su id
app.put('/api/products/:pid', async (req, res) => {
  const { pid } = req.params;

  try {
    const updatedProduct = await productManager.updateProduct(pid, req.body);

    // si el producto no existe, nos devuelve 404
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// elimina un producto segun su id
app.delete('/api/products/:pid', async (req, res) => {
  const { pid } = req.params;

  try {
    const deleted = await productManager.deleteProduct(pid);

    if (!deleted) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});


// crea un nuevo carrito vacío (pedido de un cliente)
app.post('/api/carts', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear carrito' });
  }
});


// nos devuelve los productos que contiene un carrito especifico
app.get('/api/carts/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartManager.getCartById(cid);

    // Si el carrito no existe nos devuelve 404
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    
   
    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener carrito' });
  }
});


// sgrega un producto a un carrito especifico, Si el producto ya existe en el carrito, incrementa la cantidad
app.post('/api/carts/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const updatedCart = await cartManager.addProductToCart(cid, pid);

    if (!updatedCart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
});

// este es nuestro servidor
//  el servidor comienza a escuchar en el puerto que definimos antes
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
