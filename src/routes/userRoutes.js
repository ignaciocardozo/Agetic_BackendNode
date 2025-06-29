import { Router } from 'express';
import { prisma } from '../db/db.js';
import { checkPassword, hashPassword } from '../utils/auth.js';

const router = Router();

// Crear un nuevo usuario
router.post('/register', async(req, res) => {

    // Comprobamos si el usuario ya existe
    const userExist = await prisma.user.findFirst({
        where: {
            email: req.body.email
        }
    })

    if(userExist){
        const error = new Error('El correo ya esta registrado');
        res.status(409).json({message: error.message});
        return;
    }

    // Hashear la password
    const { password } = req.body;

    // Guardar en la base de datos el usuario
    const user = await prisma.user.create({
        data: {
            ...req.body,
            password: await hashPassword(password)
        }
    });
    return res.status(201).json({message: 'Usuario creado correctamente'});
});

// Obtener todos los usuarios
router.get('/register', async(req, res) => {
    const user = await prisma.user.findMany({
        include: {
            roluser: true
        }
    });
    return res.json(user);
});

// Obtener un usuario por id
router.get('/register/:id', async(req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findFirst({
        where: {
            id: parseInt(id)
        },
        include: {
            roluser: true
        }
    });
    
    if(!user){
        return res.status(404).json({message: 'Usuario no encontrado'});
    }

    return res.status(201).json(user);
});

// Eliminar usuario
router.delete('/register/:id', async(req, res) => {
    const { id } = req.params;

    const userDelete = await prisma.user.findFirst({
        where: {
            id: parseInt(id)
        }
    });

    if(!userDelete){
        return res.status(404).json({message: 'Usuario no encontrado'});
    };

    const user = await prisma.user.delete({
        where: {
            id: parseInt(id)
        }
    });

    return res.status(201).json({message: 'Usuario eliminado correctamente'});
});

// Actualizar usuario
router.put('/register/:id', async(req, res) => {
    const { id } = req.params;

    const userUpdate = await prisma.user.findFirst({
        where: {
            id: parseInt(id)
        }
    });

    if(!userUpdate){
        return res.status(404).json({message: 'Usuario no encontrado'});
    };

    const user = await prisma.user.update({
        where: {
            id: parseInt(id)
        },
        data: req.body
    });

    return res.status(201).json({message: 'Usuario actualizado correctamente'});
});

router.post('/login', async(req, res) => {
    
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
        where: {
            email: email
        }   
    });
   
    if(!user){
        return res.status(404).json({message: 'Usuario o contraseña incorrectos'});
    }

    // comprabar el password es correcto
    const isPasswordCorrect = await checkPassword(password, user.password);
    if(!isPasswordCorrect){
        return res.status(404).json({message: 'Usuario o contraseña incorrectos'});
    };

    // return res.status(201).json({message: 'Usuario logueado correctamente'});
    return res.json(user)
});

export default router;