import utils from '../Utils/utils.js';

class CartManager {
	constructor() {
		this.cart = [];
		this.path = './src/Json/carrito.json';
		this.id = 1;
	}
	async initialize() {
		try {
			await utils.accessFile(this.path);

			const productsCartParse = await this.getCart();
			if (productsCartParse.length !== 0) {
				const productsCartParse = await this.getCart();
				this.cart = productsCartParse;
				CartManager.id = Math.max(...this.cart.map((item) => item.id)) + 1;
			}
		} catch (err) {
			await this.createFile();
		}
	}

	async getCart() {
		try {
			const getCartParse = await utils.readFile(this.path);
			return getCartParse;
		} catch (error) {
			throw error;
		}
	}

	async newOrder() {
		try {
			const order = {
				id: CartManager.id++,
				products: [],
			};

			this.cart.push(order);
			await this.createFile();

			return order;
		} catch (error) {
			throw error;
		}
	}

	async createFile() {
		try {
			await utils.writeFile(this.path, this.cart);
		} catch (error) {
			throw error;
		}
	}

	async getOrderById(id) {
		try {
			const readParse = await this.getCart();
			const getOrderById = readParse.find((item) => item.id === id);

			if (!getOrderById) {
				return undefined;
			}
			const products = getOrderById.products;
			return products;
		} catch (error) {
			throw error;
		}
	}

	async addProductToCart(cid, pid) {
		try {
			const order = this.cart.find((item) => item.id === cid);
			const exist = order.products.find((item) => item.id === pid);

			if (!exist) {
				order.products.push({ id: pid, quantity: 1 });
			} else {
				exist.quantity++;
			}

			await this.createFile();
		} catch (error) {
			throw error;
		}
	}
}

export default CartManager;