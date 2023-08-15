import utils from '../Utils/utils.js';

class ProductManager {
	products;

	constructor() {
		this.path = './src/Json/products.json';
		this.products = [];
		this.id = 1;
	}

	initialize = async () => {
		try {
			await utils.accessFile(this.path);
			const productParse = await this.getProducts();

			if (productParse.length !== 0) {
				const productsParse = await this.getProducts();
				this.products = productsParse;
				ProductManager.id =
					Math.max(...this.products.map((item) => item.id)) + 1;
			}
		} catch (err) {
			await this.createFile();
		}
	};

	async addProduct(product) {
		try {
			product.id = ProductManager.id++;
			this.products.push(product);

			await this.createFile();
		} catch (err) {
			throw err;
		}
	}

	async createFile() {
		try {
			await utils.writeFile(this.path, this.products);
		} catch (err) {
			throw err;
		}
	}

	async getProducts() {
		try {
			let data = await utils.readFile(this.path);

			return data?.length > 0 ? data : 'Aun no hay registros';
		} catch (error) {
			throw error;
		}
	}

	async getProductById(id) {
		try {
			let dato = await utils.readFile(this.path);
			this.products = dato?.length > 0 ? dato : [];
			const product = this.products.find((product) => product.id === id);

			if (!product || product === undefined) {
				throw new Error('No existe el producto solicitado');
			}

			return product;
		} catch (error) {
			throw error;
		}
	}

	async updateProduct(id, data) {
		try {
			let products = await utils.readFile(this.path);
			this.products = products?.length > 0 ? products : [];

			let productIndex = this.products.findIndex((dato) => dato.id === id);
			if (productIndex !== -1) {
				this.products[productIndex] = {
					...this.products[productIndex],
					...data,
				};
				await this.createFile(this.path, products);
				return {
					mensaje: 'producto actualizado',
					producto: this.products[productIndex],
				};
			} else {
				return { mensaje: 'no existe el producto solicitado' };
			}
		} catch (error) {
			throw error;
		}
	}

	async deleteProduct(id) {
		try {
			let products = await utils.readFile(this.path);
			this.products = products?.length > 0 ? products : [];

			let productIndex = this.products.findIndex((dato) => dato.id === id);
			if (productIndex !== -1) {
				let product = this.products[productIndex];
				this.products.splice(productIndex, 1);
				await utils.writeFile(this.path, products);
				return { mensaje: 'producto eliminado', producto: product };
			} else {
				throw new Error('No existe el producto solicitado');
			}
		} catch (error) {
			throw error;
		}
	}
}

export default ProductManager;