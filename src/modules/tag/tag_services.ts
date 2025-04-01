import Tag, { ITag } from './tag_models.js'; 
import User from '../users/user_models.js';
import mongoose from 'mongoose';

// Creating a new label
export async function createTag(tagData: {
  name: string;
  description?: string;
  category?: string;
  isActive?: boolean;
}) {
  try {
    const existingTag = await Tag.findOne({ name: tagData.name });
    if (existingTag) {
      throw new Error('La etiqueta ya existe');
    }
    
    const tag = new Tag(tagData);
    return await tag.save();
  } catch (error: any) {
    throw error;
  }
}

// Get all tabs (with paging)
export const getAllTags = async (page: number = 1, pageSize: number = 10) => {
  try {
    const skip = (page - 1) * pageSize;
    
    const tags = await Tag.find({ isActive: true })
      .sort({ name: 1 })
      .skip(skip)
      .limit(pageSize);
    
    const totalTags = await Tag.countDocuments({ isActive: true });
    const totalPages = Math.ceil(totalTags / pageSize);
    
    return {
      tags,
      totalTags,
      totalPages,
      currentPage: page,
      pageSize
    };
  } catch (error: any) {
    throw error;
  }
};

// Get tags by ID
export const getTagById = async (id: string) => {
  try {
    return await Tag.findById(id);
  } catch (error: any) {
    throw error;
  }
};

// Update Tags
export const updateTag = async (id: string, tagData: Partial<ITag>) => {
  try {
    if (tagData.name) {
      const existingTag = await Tag.findOne({ 
        name: tagData.name,
        _id: { $ne: id } 
      });
      
      if (existingTag) {
        throw new Error('Ya existe otra etiqueta con este nombre');
      }
    }
    
    return await Tag.findByIdAndUpdate(id, tagData, { new: true });
  } catch (error: any) {
    throw error;
  }
};

// Delete Tags
export const deleteTag = async (id: string) => {
  try {
    // First check if any user is using this tag
    const usersWithTag = await User.find({ tags: id });
    
    if (usersWithTag.length > 0) {
      // If the label is in use, only set it to inactive
      return await Tag.findByIdAndUpdate(id, { isActive: false }, { new: true });
    } else {
   
      return await Tag.findByIdAndDelete(id);
    }
  } catch (error: any) {
    throw error;
  }
};



// Add tags for users
export const addTagsToUser = async (userId: string, tagIds: string[]) => {
  try {
    // verification parameter
    if (!userId || !Array.isArray(tagIds)) {
      throw new Error('Usuario y lista de etiquetas son requeridos');
    }

    // Make sure all tags are present
    for (const tagId of tagIds) {
      if (!mongoose.Types.ObjectId.isValid(tagId)) {
        throw new Error(`ID de etiqueta inválido: ${tagId}`);
      }
      const tag = await Tag.findById(tagId);
      if (!tag) {
        throw new Error(`Etiqueta con ID ${tagId} no encontrada`);
      }
    }
    

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { tags: { $each: tagIds.map(id => new mongoose.Types.ObjectId(id)) } } },
      { new: true }
    ).populate('tags');
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    return user;
  } catch (error: any) {
    throw error;
  }
};

export async function addTagsToUserByName(userId: string, tagNames: string[]) {
  try {
    const tagIds: mongoose.Types.ObjectId[] = [];
    
    for (const name of tagNames) {
      let tag = await Tag.findOne({ name });
      
      if (!tag) {
        tag = await createTag({ 
          name, 
          description: '', 
          category: 'user-generated',
          isActive: true
        });
      }
      
      tagIds.push(tag._id as mongoose.Types.ObjectId);
    }
    return await addTagsToUser(userId, tagIds.map(id => id.toString()));
  } catch (error: any) {
    throw error;
  }
}

export const removeTagFromUser = async (userId: string, tagId: string) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { tags: tagId } },
      { new: true }
    ).populate('tags');
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    return user;
  } catch (error: any) {
    throw error;
  }
};

export const getUserTags = async (userId: string) => {
  try {
    const user = await User.findById(userId).populate('tags');
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    return user.tags;
  } catch (error: any) {
    throw error;
  }
};

// Find users by tab (paging)
export const findUsersByTag = async (tagId: string, page: number = 1, pageSize: number = 10) => {
  try {
    const skip = (page - 1) * pageSize;
    
    const users = await User.find({ 
      tags: tagId,
      isHidden: false
    })
    .sort({ name: 1 })
    .skip(skip)
    .limit(pageSize);
    
    const totalUsers = await User.countDocuments({ 
      tags: tagId,
      isHidden: false 
    });
    
    const totalPages = Math.ceil(totalUsers / pageSize);
    
    return {
      users,
      totalUsers,
      totalPages,
      currentPage: page,
      pageSize
    };
  } catch (error: any) {
    throw error;
  }
};

// Find users by tag name
export async function findUsersByTagName(tagName: string, page: number = 1, pageSize: number = 10) {
  try {
    const tag = await Tag.findOne({ name: tagName });
    if (!tag) {
      return {
        users: [],
        totalUsers: 0,
        totalPages: 0,
        currentPage: page,
        pageSize
      };
    }
    

    const tagId = (tag._id as mongoose.Types.ObjectId).toString();
    return await findUsersByTag(tagId, page, pageSize);
  } catch (error: any) {
    throw error;
  }
}


export const searchTags = async (query: string, page: number = 1, pageSize: number = 10) => {
  try {
    const skip = (page - 1) * pageSize;
    
    const tags = await Tag.find({
      isActive: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    })
    .sort({ name: 1 })
    .skip(skip)
    .limit(pageSize);
    
    const totalTags = await Tag.countDocuments({
      isActive: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    });
    
    const totalPages = Math.ceil(totalTags / pageSize);
    
    return {
      tags,
      totalTags,
      totalPages,
      currentPage: page,
      pageSize
    };
  } catch (error: any) {
    throw error;
  }
};