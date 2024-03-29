const ProductManager = require('../ProductManager'); // Importa el módulo ProductManager para gestionar los productos
const { Router } = require('express'); // Importa la clase Router de Express para definir las rutas
const router = Router(); // Crea un enrutador

const manager = new ProductManager(`${__dirname}/../../assets/products.json`); // Crea una instancia del ProductManager para manejar los productos

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await manager.getProducts(); // Obtiene todos los productos
        const limitFilter = req.query.limit; // Obtiene el parámetro de consulta "limit"

        if (limitFilter) { // Si se proporciona el parámetro "limit"
            if (limitFilter <= 0 || isNaN(parseInt(limitFilter))) { // Verifica si el parámetro "limit" es válido
                res.status(400).json({ error: 'Debe ingresar un número válido superior a 0.' }); // Responde con un error 400 si el parámetro es inválido
                return;
            } else {
                const limit = parseInt(limitFilter); // Convierte el valor de "limit" a un número entero
                const limitedProducts = products.slice(0, limit); // Obtiene los productos limitados según el valor de "limit"
                res.json(limitedProducts); // Responde con los productos limitados
            }
        } else {
            res.json(products); // Responde con todos los productos si no se proporciona el parámetro "limit"
        }
    } catch {
        res.status(500).json({ Error: 'Error al cargar los productos' }); // Responde con un error 500 si hay un error al obtener los productos
    };
});

// Ruta para obtener un producto por su ID
router.get('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid); // Obtiene el ID del producto de los parámetros de la solicitud
        const product = await manager.getProductById(productId); // Obtiene el producto por su ID
        res.status(200).json(product); // Responde con el producto obtenido
    } catch {
        res.status(500).json({ Error: 'Error al cargar los productos' }); // Responde con un error 500 si hay un error al obtener el producto
    }
});

// Ruta para agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, status, stock } = req.body; // Obtiene los datos del producto del cuerpo de la solicitud
        await manager.addProduct(title, description, price, thumbnail, code, status, stock); // Agrega el nuevo producto
        res.status(201).json({ message: 'Producto agregado correctamente' }); // Responde con un mensaje de éxito
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto' }); // Responde con un error 500 si hay un error al agregar el producto
    }
});

// Ruta para actualizar un producto por su ID
router.put('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid); // Obtiene el ID del producto de los parámetros de la solicitud
        await manager.updateProduct(productId, req.body); // Actualiza el producto
        res.status(200).json({ message: 'Producto actualizado' }); // Responde con un mensaje de éxito
    } catch {
        res.status(500).json({ error: 'Error al actualizar el producto' }); // Responde con un error 500 si hay un error al actualizar el producto
    }
});

// Ruta para eliminar un producto por su ID
router.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid); // Obtiene el ID del producto de los parámetros de la solicitud
        await manager.deleteProduct(productId); // Elimina el producto
        res.status(200).json({ message: 'Producto eliminado' }); // Responde con un mensaje de éxito
    } catch {
        res.status(500).json({ error: 'Error al eliminar el producto' }); // Responde con un error 500 si hay un error al eliminar el producto
    }
});

module.exports = router; // Exporta el enrutador
