import express from 'express';
import cartRouter from './Routes/cartRouter.js';
import ProductsRouter from './Routes/productsRouter.js';

const app = express();
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', ProductsRouter);
app.use('/api/cart', cartRouter);

app.listen(port, () => {
	console.log(
		`Servidor corriendo en el puerto ${port} 
        http://localhost:${port}`
	);
});