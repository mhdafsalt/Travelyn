const path = require('path');
const Razorpay = require('razorpay');
const dotenv = require('dotenv');

// Robust dotenv loading: always loads backend/.env regardless of current working directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
  throw new Error('Razorpay API credentials are missing. Check your backend/.env file for RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.');
}

const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

module.exports = razorpay;
module.exports.razorpay = razorpay;
