import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String,
    required: true
  },
  verifyOtp: {
    type: String,
    default: ''
    },
    verifyOtpExpireAt: {
    type: Number,
    default: 0
    },
  isAccountVerified: {
    type: Boolean,
    default: false
    },
    resetOtp: {
    type: String,
    default: ''
    },
    resetOtpExpireAt: {
    type: Number,
    default: 0
    },
});

const User = mongoose.model('User', userSchema);
export default User;
