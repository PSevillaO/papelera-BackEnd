import { getConnection, getPool } from "../database/database"


const getOrders = async (req, res) => {
    const pool = getPool();
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();
        const result = await connection.query("select * from orders as a inner join products c on c.product_id = a.product_id where customer_id = ? and pedido = (select max(pedido) from orders as b where a.customer_id = b.customer_id)", id);
        res.json(result);
        connection.release();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


const addOrders = async (req, res) => {
    const pool = getPool();
    try {
        const { product_id, pedido, customer_id, precio, quantity, fecha_entrega, obs } = req.body;
        const orders = { product_id, pedido, customer_id, precio, quantity, fecha_entrega, obs };

        const connection = await pool.getConnection();
        await connection.query("INSERT INTO orders SET ?, fecha_creacion = NOW()", orders);

        res.json({ messaje: "Orders add" });
        connection.release();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const addMultipleOrders = async (req, res) => {
    const pool = getPool();
    try {
        const { pedidosData } = req.body;

        const connection = await pool.getConnection();

        // Itera sobre los pedidos y ejecuta la inserción para cada uno
        for (const order of pedidosData) {
            await connection.query("INSERT INTO orders SET ?", order);
        }

        res.json({ message: "Orders added" });
        connection.release();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


// trae el maximo valor de los pedidos a ese numero le sumo 1
const getPedidos = async (req, res) => {
    const pool = getPool();
    try {
        const connection = await pool.getConnection();
        const result = await connection.query("select max(pedido) as pedido from orders");
        console.log(result);
        res.json(result);
        connection.release();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


export const methods = {
    getOrders,
    addOrders,
    addMultipleOrders,
    getPedidos,
}