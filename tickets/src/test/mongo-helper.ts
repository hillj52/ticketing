import mongoose from 'mongoose';

const generateId = () => mongoose.Types.ObjectId().toHexString();

export { generateId };
