const mongoose = require('mongoose');

exports.connectDB = async () => {
await mongoose.connect(process.env.DATABASE_URL);
console.log('Connected to the database');
}