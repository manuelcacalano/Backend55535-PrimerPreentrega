import CartManager from '../Manager/cartManager.js';
import ProductManager from '../Manager/ProductManager.js';
import { Router } from 'express';

const cartRouter = Router();

cartRouter.post('/', async (req, res) => {
	try {
		const cart = new CartManager();
		await cart.initialize();

		const newCart = await cart.newOrder();
		res.status(200).send(newCart);
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
});

cartRouter.get('/', async (req, res) => {
	try {
		const cart = new CartManager();
		await cart.initialize();
		const getCart = await cart.getCart();
		res.status(200).send(getCart);
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
});

cartRouter.get('/:cid', async (req, res) => {
	const { cid } = req.params;
	try {
		if (!cid) {
			return res.status(400).send({ error: 'id no es un numero' });
		}

		const cart = new CartManager();
		await cart.initialize();

		const getOrderById = await cart.getOrderById(parseInt(cid));

		if (!getOrderById) {
			return res.status(404).send({ error: 'cart no encontrado' });
		}

		res.status(200).send({ cart: getOrderById });
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
});

cartRouter.post('/:cid/products/:pid', async (req, res) => {
	try {
		const cart = new CartManager();
		const productManager = new ProductManager();
		const { cid, pid } = req.params;

		await cart.initialize();
		await productManager.initialize();

		const getOrderById = await cart.getOrderById(parseInt(cid));
		if (!getOrderById) {
			return res.status(404).send({ error: 'cart no encontrado' });
		}

		const getProductById = await productManager.getProductById(parseInt(pid));
		if (!getProductById) {
			return res.status(404).send({ error: 'product no encontrado' });
		}

		await cart.addProductToCart(parseInt(cid), parseInt(pid));

		res
			.status(200)
			.send({ message: 'product agregado al cart', product: getProductById });
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
});

export default cartRouter;