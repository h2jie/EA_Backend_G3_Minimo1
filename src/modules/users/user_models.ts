import mongoose, { Schema } from "mongoose";

export interface IUser {
  name: string;
  birthDate: Date;
  email: string;
  password: string;
  isAdmin: boolean;
  isHidden: boolean;
  tags: mongoose.Types.ObjectId[]; // 修改为对标签集合的引用
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  birthDate: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag',
    default: []
  }]
});

const User = mongoose.model('User', userSchema);
export default User;