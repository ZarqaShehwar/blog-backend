const express = require('express');
const cors = require('cors');
const cookieParser  = require('cookie-parser');
const AppError = require('./utils/AppError');
const { globalErrorHandling } = require('./utils/GlobalErrorHandling');
const authRouter = require('./routes/authRoutes');
const postRouter = require('./routes/postRoutes');

const app = express();
const allowedOrigins = [
  process.env.CORS_ORIGIN_FRONTEND_PROD, 
   process.env.CORS_ORIGIN_FRONTEND_LOCAL
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log( process.env.CORS_ORIGIN_FRONTEND_PROD, 
   process.env.CORS_ORIGIN_FRONTEND_LOCAL,"Origins are thereee ");
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, 
  optionsSuccessStatus: 200 
};

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