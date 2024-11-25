const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    try {

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        res.status(200).json({
            message: 'Login realizado com sucesso!',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    console.log(name, email, password, role);

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email já está em uso' });
        }

        const newUser = new User({
            name,
            email,
            password,
            role: role || 'user' 
        });

        await newUser.save();

        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

router.get('/users/:id?', async (req, res) => {
    const { id } = req.params;

    try {
        if (id) {
            const user = await User.findById(id, '-password'); 
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }
            return res.status(200).json(user);
        }

        const users = await User.find({}, '-password');
        res.status(200).json(users);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ message: 'Erro ao buscar usuários.' });
    }
});


router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'ID do usuário não fornecido' });
    }

    console.log(`Tentando excluir o usuário com ID: ${id}`); 

    try {
        const user = await User.findById(id);

        if (!user) {
            console.log('Usuário não encontrado');  
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        await User.findByIdAndDelete(id);
        console.log(`Usuário com ID ${id} excluído com sucesso!`);
        res.status(200).json({ message: 'Usuário excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir usuário:', error); 
        res.status(500).json({ message: 'Erro ao excluir usuário' });
    }
});

router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Nome e email são obrigatórios.' });
    }

    try {
        const user = await User.findByIdAndUpdate(
            id,
            { name, email },
            { new: true } 
        );

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json({ message: 'Usuário atualizado com sucesso!', user });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ message: 'Erro ao atualizar usuário.' });
    }
});

module.exports = router;
