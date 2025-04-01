import { Request, Response } from 'express';
import * as tagService from './tag_services.js';

// Creating Tags
export const createTagHandler = async (req: Request, res: Response) => {
  try {
    const newTag = await tagService.createTag(req.body);
    return res.status(201).json(newTag);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// Get all tabs (with paging)
export const getAllTagsHandler = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    
    const result = await tagService.getAllTags(page, pageSize);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get tags by ID
export const getTagByIdHandler = async (req: Request, res: Response) => {
  try {
    const tag = await tagService.getTagById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: 'Etiqueta no encontrada' });
    }
    return res.status(200).json(tag);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Update Tags
export const updateTagHandler = async (req: Request, res: Response) => {
  try {
    const updatedTag = await tagService.updateTag(req.params.id, req.body);
    if (!updatedTag) {
      return res.status(404).json({ message: 'Etiqueta no encontrada' });
    }
    return res.status(200).json(updatedTag);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// Delete Tags
export const deleteTagHandler = async (req: Request, res: Response) => {
  try {
    const deletedTag = await tagService.deleteTag(req.params.id);
    if (!deletedTag) {
      return res.status(404).json({ message: 'Etiqueta no encontrada' });
    }
    return res.status(200).json({ message: 'Etiqueta eliminada correctamente' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Add tags for users
export const addTagsToUserHandler = async (req: Request, res: Response) => {
  try {
    const { tagIds } = req.body;
    
    if (!Array.isArray(tagIds) || tagIds.length === 0) {
      return res.status(400).json({ message: 'Se requiere un array de IDs de etiquetas' });
    }
    
    const updatedUser = await tagService.addTagsToUser(req.params.userId, tagIds);
    return res.status(200).json(updatedUser);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// Remove tags from users
export const removeTagFromUserHandler = async (req: Request, res: Response) => {
  try {
    const updatedUser = await tagService.removeTagFromUser(req.params.userId, req.params.tagId);
    return res.status(200).json(updatedUser);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// Get all tags of the user
export const getUserTagsHandler = async (req: Request, res: Response) => {
  try {
    const tags = await tagService.getUserTags(req.params.userId);
    return res.status(200).json(tags);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// Find Users by Tag
export const findUsersByTagHandler = async (req: Request, res: Response) => {
  try {
    const tagId = req.params.tagId;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 10;
    
    const result = await tagService.findUsersByTag(tagId, page, pageSize);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// search tags
export const searchTagsHandler = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string || '';
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 10;
    
    const result = await tagService.searchTags(query, page, pageSize);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};