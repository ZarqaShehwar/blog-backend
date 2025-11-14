const express = require('express');
const cors = require('cors');
const cookieParser  = require('cookie-parser');
const AppError = require('./utils/AppError');
const { globalErrorHandling } = require('./utils/GlobalErrorHandling');
const authRouter = require('./routes/authRoutes');
const postRouter = require('./routes/postRoutes');

const app = express();
console.log(process.env.CORS_ORIGIN_FRONTEND_PROD);


// Define your allowed origin
const allowedOrigins = ['https://blogapp-tau-beryl.vercel.app'];

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the request's origin is in our allowed list
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // Allow the request
      callback(null, true);
    } else {
      // Block the request
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // This is the key! It allows cookies to be sent.
  optionsSuccessStatus: 200 // For legacy browser support
};

// Use the cors middleware with these options
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// app.use('/img',express.static('public/img/product'))
app.use('/auth',authRouter);
app.use('/api/v1/blogs',postRouter);
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express on Vercel!' });
})

app.all('/*splat', (req, res,next) => {
next(new AppError(`Cannot find ${req.originalUrl} route on this server`,404));
});
app.use(globalErrorHandling)

module.exports = app;