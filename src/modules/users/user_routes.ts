import express from 'express';
import {
    saveMethodHandler,
    createUserHandler,
    getAllUsersHandler,
    getUserByIdHandler,
    updateUserHandler,
    deleteUserHandler,
    hideUserHandler,
    loginUserHandler
} from '../users/user_controller.js';
import User from './user_models.js';

const router = express.Router();

/**
 * @openapi
 * /api/main:
 *   get:
 *     summary: Página de bienvenida
 *     description: Retorna un mensaje de bienvenida.
 *     tags:
 *       - Main
 *     responses:
 *       200:
 *         description: Éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bienvenido a la API
 */
router.get('/main', saveMethodHandler);

/**
 * @openapi
 * /api/users/register:
 *   post:
 *     summary: Crea un nuevo usuario
 *     description: Añade los detalles de un nuevo usuario.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario (mínimo 8 caracteres)
 *               isAdmin:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error de validación
 */
router.post('/users/register', createUserHandler);

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Obtiene una lista de usuarios con paginación
 *     description: Retorna una lista de usuarios paginada.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: pageSize
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           enum: [10, 25, 50]
 *           default: 10
 *     responses:
 *       200:
 *         description: Éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   birthDate:
 *                     type: string
 *                     format: date
 *                   email:
 *                     type: string
 *                   isAdmin:
 *                     type: boolean
 *                   isHidden:
 *                     type: boolean
 *       400:
 *         description: Tamaño de página inválido
 *       500:
 *         description: Error interno del servidor
 */
router.get('/users', getAllUsersHandler);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     description: Retorna los detalles de un usuario específico.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 birthDate:
 *                   type: string
 *                   format: date
 *                 email:
 *                   type: string
 *                 isAdmin:
 *                   type: boolean
 *                 isHidden:
 *                   type: boolean
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/users/:id', getUserByIdHandler);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Actualiza un usuario por ID
 *     description: Modifica los detalles de un usuario específico.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               email:
 *                 type: string
 *               isAdmin:
 *                 type: boolean
 *               isHidden:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/users/:id', updateUserHandler);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Elimina un usuario por ID
 *     description: Elimina un usuario específico de la base de datos.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/users/:id', deleteUserHandler);

/**
 * @openapi
 * /api/users/{id}/oculto:
 *   put:
 *     summary: Cambia la visibilidad de un usuario por ID
 *     description: Establece el campo isHidden de un usuario específico a true o false.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isHidden:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/users/:id/oculto', hideUserHandler);

/**
 * @openapi
 * /api/users/login:
 *   post:
 *     summary: Inicia sesión
 *     description: Inicia sesión con un usuario existente.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Inicio de sesión completado
 *       400:
 *         description: Usuario no encontrado o contraseña incorrecta
 */
router.post('/users/login', loginUserHandler);




/**
 * @openapi
 * /api/users/{id}/tags:
 *   get:
 *     summary: Obtiene todas las etiquetas de un usuario
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de etiquetas del usuario
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/users/:id/tags', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user.tags || []);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
});

/**
 * @openapi
 * /api/users/{id}/tags:
 *   post:
 *     summary: Añade etiquetas a un usuario
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado con nuevas etiquetas
 *       404:
 *         description: Usuario no encontrado
 */
router.post('/users/:id/tags', async (req, res) => {
    try {
        const { tags } = req.body;

        if (!Array.isArray(tags)) {
            return res.status(400).json({ message: 'tags debe ser un array de strings' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Asegurar que no hay duplicados
        const newTags = [...new Set([...user.tags, ...tags])];

        user.tags = newTags;
        await user.save();

        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
});

/**
 * @openapi
 * /api/users/{id}/tags/{tag}:
 *   delete:
 *     summary: Elimina una etiqueta de un usuario
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: tag
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado tras eliminar la etiqueta
 *       404:
 *         description: Usuario no encontrado
 */

router.delete('/users/:id/tags/:tag', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.tags = user.tags.filter(tag => tag.toString() !== req.params.tag);
        await user.save();

        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @openapi
 * /api/users/bytags:
 *   get:
 *     summary: Busca usuarios por etiquetas
 *     tags:
 *       - Users
 *     parameters:
 *       - name: tags
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de usuarios con la etiqueta especificada
 */
router.get('/users/bytags', async (req, res) => {
    try {
        const tag = req.query.tags;

        if (!tag) {
            return res.status(400).json({ message: 'Se requiere al menos una etiqueta' });
        }

        const users = await User.find({
            tags: tag,
            isHidden: false
        });

        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
});

export default router;