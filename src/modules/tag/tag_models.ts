import mongoose, { Schema, Document } from "mongoose";

export interface ITag extends Document {
  name: string;
  description: string;
  category: string;
  createdAt: Date;
  isActive: boolean;
}

const tagSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: false
  },
  category: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const Tag = mongoose.model<ITag>('Tag', tagSchema);
export default Tag;