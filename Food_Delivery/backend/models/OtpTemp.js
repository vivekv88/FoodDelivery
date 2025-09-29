import mongoose from "mongoose";

const otpTempSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String, 
  otp: String,
  otpExpiry: Date
});

const OtpModel = mongoose.models.otp || mongoose.model("OtpTemp", otpTempSchema);

export default OtpModel;
