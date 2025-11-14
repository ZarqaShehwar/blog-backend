const mongoose = require('mongoose');

/**
 * Connects to the MongoDB database using the URL
 * from the environment variables.
 */
exports.connectDB = async () => {
  try {
    // Check if the database URL is provided
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not defined in environment variables.');
      process.exit(1); // Exit the process with a failure code
    }

    // Attempt to connect to the database
    await mongoose.connect(process.env.DATABASE_URL);
    
    // Log a success message if the connection is established
    console.log('Connected to the database');

  } catch (error) {
    // This block will run if the `await mongoose.connect` fails
    
    // Log a clear error message with details
    console.error('DATABASE CONNECTION FAILED:', error.message);
    
    // Exit the process with a failure code.
    // This is crucial for deployment platforms (like Vercel/AWS)
    // as it signals that the container has failed and should be recycled.
    process.exit(1);
  }
};