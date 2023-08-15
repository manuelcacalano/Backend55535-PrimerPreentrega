import ProductManager from '../Manager/ProductManager.js';
import { Router } from 'express';

const ProductsRouter = Router();

//Ruta para obtener todos los productos o los productos limitados.
ProductsRouter.get('/', async (req, res) => {
	try {
		const { limit } = req.query;
		const products = new ProductManager();
		await products.initialize();
		// Obtener el producto por ID
		const productosBelleza = await products.getProducts();
		// Obtener el parámetro "limit" de la consulta
		if (limit > 0 && limit < productosBelleza.length) {
			// Si se proporciona el parámetro "limit", devolver solo los primeros productos según el límite especificado
			const limitedProducts = productosBelleza.slice(0, limit);
			return res.status(200).send(limitedProducts);
		}
		// Si no se proporciona el parámetro "limit", devolver todos los productos
		res.status(200).send(productosBelleza);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'Error al leer el archivo de productos' });
	}
});

// Ruta para obtener un producto por su ID
ProductsRouter.get('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const products = new ProductManager();
		await products.initialize();
		const productosBelleza = await products.getProductById(parseInt(id));

		if (!productosBelleza) {
			return res.status(404).send({ error: 'product no encontrado' });
		}
		res.status(200).send(productosBelleza);
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
});

ProductsRouter.post('/', async (req, res) => {
	try {
		const { title, description, code, price, stock, thumbnail, category } =
			req.body;
		const products = new ProductManager();
		await products.initialize();
		const exist = await products.getProducts();

		if (exist.some((item) => item.code === code)) {
			return res
				.status(400)
				.send({ error: 'El codigo del producto ya esta en uso' });
		}

		//campos obligatorios
		if (!title || !description || !code || !price || !stock || !category) {
			return res
				.status(400)
				.send({ error: 'Todos los campos son obligatorios' });
		}

		//thumbnails es un array
		if (thumbnail && !Array.isArray(thumbnail)) {
			return res.send({ error: 'El campo de imágenes debe ser un array' });
		}
		//thumbnail es obligatoria
		if ((thumbnail && thumbnail.length === 0) || thumbnail === '') {
			return res.send({ error: 'Falta ingresar una o más imágenes' });
		}

		const newProduct = {
			title,
			description,
			code,
			price,
			stock,
			thumbnail,
			category,
		};

		newProduct.status = true;

		await products.addProduct(newProduct);
		res.status(200).send(newProduct);
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
});

ProductsRouter.put('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const { title, description, code, price, stock, category, thumbnail } =
			req.body;
		const products = new ProductManager();
		await products.initialize();
		const getProductById = await products.getProductById(parseInt(id));
		if (!getProductById) {
			return res.status(404).send({ error: 'product no encontrado' });
		}
		if (!title || !description || !code || !price || !stock || !category) {
			return res.status(400).send({ error: 'Faltan completar datos' });
		}
		const updateProduct = {
			title,
			description,
			code,
			price,
			stock,
			category,
			thumbnail,
		};
		updateProduct.status = true;
		const updatedProduct = await products.updateProduct(
			parseInt(id),
			updateProduct
		);
		res.status(200).send(updatedProduct);
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
});

ProductsRouter.delete('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const products = new ProductManager();
		await products.initialize();

		const getProductById = await products.getProductById(parseInt(id));

		if (!getProductById) {
			return res.status(404).send({ error: 'product no encontrado' });
		}
		await products.deleteProduct(parseInt(id));
		res.status(200).send({ success: 'Producto eliminado', getProductById });
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
});

export default ProductsRouter;