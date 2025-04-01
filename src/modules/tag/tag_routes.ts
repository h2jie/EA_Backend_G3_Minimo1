import express from 'express';
import {
  createTagHandler,
  getAllTagsHandler,
  getTagByIdHandler,
  updateTagHandler,
  deleteTagHandler,
  addTagsToUserHandler,
  removeTagFromUserHandler,
  getUserTagsHandler,
  findUsersByTagHandler,
  searchTagsHandler
} from './tag_controller.js';

const router = express.Router();

/**
 * @openapi
 * /api/tags:
 *   post:
 *     summary: Crea una nueva etiqueta
 *     tags:
 *       - Tags
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Etiqueta creada exitosamente
 *       400:
 *         description: Error al crear la etiqueta
 */
router.post('/tags', createTagHandler);

/**
 * @openapi
 * /api/tags:
 *   get:
 *     summary: Obtiene todas las etiquetas con paginación
 *     tags:
 *       - Tags
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista de etiquetas
 *       500:
 *         description: Error del servidor
 */
router.get('/tags', getAllTagsHandler);

/**
 * @openapi
 * /api/tags/{id}:
 *   get:
 *     summary: Obtiene una etiqueta por su ID
 *     tags:
 *       - Tags
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Etiqueta encontrada
 *       404:
 *         description: Etiqueta no encontrada
 */
router.get('/tags/:id', getTagByIdHandler);

/**
 * @openapi
 * /api/tags/{id}:
 *   put:
 *     summary: Actualiza una etiqueta
 *     tags:
 *       - Tags
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
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Etiqueta actualizada
 *       404:
 *         description: Etiqueta no encontrada
 */
router.put('/tags/:id', updateTagHandler);

/**
 * @openapi
 * /api/tags/{id}:
 *   delete:
 *     summary: Elimina una etiqueta (soft delete)
 *     tags:
 *       - Tags
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Etiqueta eliminada
 *       404:
 *         description: Etiqueta no encontrada
 */
router.delete('/tags/:id', deleteTagHandler);

/**
 * @openapi
 * /api/tags/search:
 *   get:
 *     summary: Busca etiquetas por nombre, descripción o categoría
 *     tags:
 *       - Tags
 *     parameters:
 *       - name: q
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Resultados de búsqueda
 */
router.get('/tags/search', searchTagsHandler);

/**
 * @openapi
 * /api/users/{userId}/tags:
 *   get:
 *     summary: Obtiene todas las etiquetas de un usuario
 *     tags:
 *       - Users
 *       - Tags
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de etiquetas del usuario
 *       400:
 *         description: Error al obtener las etiquetas
 */
router.get('/users/:userId/tags', getUserTagsHandler);

/**
 * @openapi
 * /api/users/{userId}/tags:
 *   post:
 *     summary: Añade etiquetas a un usuario
 *     tags:
 *       - Users
 *       - Tags
 *     parameters:
 *       - name: userId
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
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Etiquetas añadidas al usuario
 *       400:
 *         description: Error al añadir etiquetas
 */
router.post('/users/:userId/tags', addTagsToUserHandler);

/**
 * @openapi
 * /api/users/{userId}/tags/{tagId}:
 *   delete:
 *     summary: Elimina una etiqueta de un usuario
 *     tags:
 *       - Users
 *       - Tags
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: tagId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Etiqueta eliminada del usuario
 *       400:
 *         description: Error al eliminar la etiqueta
 */
router.delete('/users/:userId/tags/:tagId', removeTagFromUserHandler);

/**
 * @openapi
 * /api/tags/{tagId}/users:
 *   get:
 *     summary: Busca usuarios por etiqueta
 *     tags:
 *       - Users
 *       - Tags
 *     parameters:
 *       - name: tagId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista de usuarios con la etiqueta
 *       500:
 *         description: Error del servidor
 */
router.get('/tags/:tagId/users', findUsersByTagHandler);

export default router;