// src/services/user_service.ts
import Tag, { ITag } from '../tag/tag_models.js';
import User, { IUser } from '../users/user_models.js';

export const saveMethod = () => {
    return 'Hola';
};

// Crear usuario con validaciones
export const createUser = async (userData: IUser) => {
    // Verificar si el nombre de usuario o correo ya existen
    const existingUser = await User.findOne({
        $or: [{ name: userData.name }, { email: userData.email }]
    });

    if (existingUser) {
        throw new Error('El nombre de usuario o el correo electrónico ya están en uso');
    }

    // Verificar que la contraseña tenga al menos 8 caracteres
    if (userData.password.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
    }

    const user = new User(userData);
    return await user.save();
};
// Obtener usuarios (solo los visibles)
export const getAllUsers = async (page: number = 1, pageSize: number = 10) => {
    const skip = (page - 1) * pageSize;
    const users = await User.find()
                            .sort({ isHidden: 1 }) // primero los visibles
                            .skip(skip)
                            .limit(pageSize);
    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / pageSize);
    return {
        users,
        totalUsers,
        totalPages,
        currentPage: page
   }; 
};


// Obtener un usuario por ID
export const getUserById = async (id: string) => {
    const user = await User.findById(id);
    if (user) {
        return { ...user.toObject(), age: calculateAge(user.birthDate) };
    }
    return null;
};

// Actualizar usuario
export const updateUser = async (id: string, updateData: Partial<IUser>) => {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
};

// Eliminar usuario
export const deleteUser = async (id: string) => {
    return await User.findByIdAndDelete(id);
};

// Ocultar o mostrar usuario
export const hideUser = async (id: string, isHidden: boolean) => {
    return await User.findByIdAndUpdate(id, { isHidden }, { new: true });
};

// Iniciar sesión
export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    // Verificar si el usuario está oculto
    if (user.isHidden) {
        throw new Error('Este usuario está oculto y no puede iniciar sesión');
    }

    // Comparar la contraseña ingresada con la almacenada
    if (user.password !== password) {
        throw new Error('Contraseña incorrecta');
    }

    return user;
};

// Calcular edad a partir de la fecha de nacimiento
const calculateAge = (birthDate: Date) => {
    if (!birthDate) {
        return null;
    }
    const diff = Date.now() - new Date(birthDate).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

// Contar usuarios (solo los visibles)
export const getUserCount = async () => {
    return await User.countDocuments({ isHidden: false });
};



// 为用户添加标签
export const addTagsToUser = async (userId: string, tags: string[]) => {
    // 验证所有标签都存在
    const existingTags = await Tag.find({ name: { $in: tags } });
    if (existingTags.length !== tags.length) {
      throw new Error('Algunos de los tags proporcionados no existen');
    }
    
    // 添加标签到用户
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { tags: { $each: tags } } }, // 使用 $addToSet 避免重复
      { new: true }
    );
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    return user;
  };
  
  // 从用户移除标签
  export const removeTagFromUser = async (userId: string, tag: string) => {
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { tags: tag } },
      { new: true }
    );
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    return user;
  };
  
  // 获取用户的所有标签
  export const getUserTags = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    return user.tags;
  };
  
  // 根据标签查找用户（分页）
  export const findUsersByTags = async (tags: string[], page: number = 1, pageSize: number = 10) => {
    const skip = (page - 1) * pageSize;
    const users = await User.find({ tags: { $all: tags } })
      .sort({ isHidden: 1 })
      .skip(skip)
      .limit(pageSize);
    
    const totalUsers = await User.countDocuments({ tags: { $all: tags } });
    const totalPages = Math.ceil(totalUsers / pageSize);
    
    return {
      users,
      totalUsers,
      totalPages,
      currentPage: page
    };
  };
  
  // 创建标签
  export const createTag = async (tagData: ITag) => {
    const existingTag = await Tag.findOne({ name: tagData.name });
    if (existingTag) {
      throw new Error('El tag ya existe');
    }
    
    const tag = new Tag(tagData);
    return await tag.save();
  };
  
  // 获取所有标签
  export const getAllTags = async () => {
    return await Tag.find({ isActive: true });
  };
  
// 获取热门标签（按用户使用量）
export const getPopularTags = async (limit: number = 10) => {
    const users = await User.find();
    
    // 计算每个标签的使用次数
    const tagCounts: Record<string, number> = {};
    users.forEach(user => {
      if (user.tags && user.tags.length > 0) {
        user.tags.forEach(tag => {
          const tagKey = tag.toString();
          tagCounts[tagKey] = (tagCounts[tagKey] || 0) + 1;
        });
      }
    });
    
    // 转换为数组并排序
    const sortedTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
    
    return sortedTags;
  };