const express = require('express');
const cors = require('cors');
const cookieParser  = require('cookie-parser');
const AppError = require('./utils/AppError');
const { globalErrorHandling } = require('./utils/GlobalErrorHandling');
const authRouter = require('./routes/authRoutes');
const postRouter = require('./routes/postRoutes');

const app = express();

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true,               
}));
app.use(express.json());
app.use(cookieParser());

// app.use('/img',express.static('public/img/product'))
app.use('/auth',authRouter);
app.use('/api/v1/blogs',postRouter);


app.all('/*splat', (req, res,next) => {
next(new AppError(`Cannot find ${req.originalUrl} route on this server`,404));
});
app.use(globalErrorHandling)

module.exports = app;