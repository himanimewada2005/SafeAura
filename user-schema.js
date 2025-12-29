import mongoose from "mongoose";

// Relative sub-schema
const RelativeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true }
}, { _id: false });

// Account sub-schema
const AccountSchema = new mongoose.Schema({
  phone: { type: String, required: true, trim: true },
  isPhoneVerified: { type: Boolean, default: false },
  relatives: {
    type: [RelativeSchema],
    validate: {
      validator: v => Array.isArray(v) && v.length >= 1 && v.length <= 5,
      message: 'You must provide 1 to 5 relatives'
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


// User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['user','admin'], default: 'user' },
  account: AccountSchema
}, { timestamps: true });


export default mongoose.model("User", userSchema);
