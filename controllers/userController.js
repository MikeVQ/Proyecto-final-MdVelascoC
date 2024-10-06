const express = require('express');
const User = require('../schemas/userModel');
const router = express.Router();

// GET: Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
});

// POST: Crear un nuevo usuario
router.post('/', async (req, res) => {
    const { name, email, phone, address } = req.body;
    try {
        const user = new User({ name, email, phone, address });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear usuario' });
    }
});

// PUT: Actualizar un usuario
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;
    try {
        const user = await User.findByIdAndUpdate(id, { name, email, phone, address }, { new: true });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar usuario' });
    }
});

// DELETE: Eliminar un usuario
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar usuario' });
    }
});


module.exports = router;
