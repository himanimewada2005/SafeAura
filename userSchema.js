import mongoose from "mongoose";

// Relative sub-schema
const RelativeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Relative name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Relative phone is required'],
    trim: true
  }
}, { _id: false });

// Account sub-schema
const AccountSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  isPhoneVerified: {           // <-- OTP verified flag
    type: Boolean,
    default: false
  },
  relatives: {
    type: [RelativeSchema],
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length >= 1 && v.length <= 5;
      },
      message: 'You must provide at least 1 and maximum 5 relatives'
    },
    default: []
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    lat: Number,
    lng: Number
  }
}, { _id: false });

// Updated User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  account: AccountSchema
}, { timestamps: true });


export default mongoose.model("User", userSchema);
