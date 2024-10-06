const express = require('express');
const Order = require('../schemas/orderModel');
const router = express.Router();

// GET: Obtener todas las órdenes
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().populate('user');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener órdenes' });
    }
});

// POST: Crear una nueva orden
router.post('/', async (req, res) => {
    const { user, products, total, deliveryDate } = req.body;
    try {
        const order = new Order({ user, products, total, deliveryDate });
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear orden' });
    }
});

// PUT: Actualizar una orden
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { products, total, deliveryDate } = req.body;
    try {
        const order = await Order.findByIdAndUpdate(id, { products, total, deliveryDate }, { new: true });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar orden' });
    }
});

// DELETE: Eliminar una orden
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Order.findByIdAndDelete(id);
        res.status(200).json({ message: 'Orden eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar orden' });
    }
});

module.exports = router;
