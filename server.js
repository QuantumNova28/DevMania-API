import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import colors from 'colors';
import errorHandler from './middleware/error.js';

// Routes
import bootcamps from './routes/bootcamps.js';

// Load env vars
dotenv.config({ path: './config/.env' });

// Connect to Database
// console.log(`URI : ${process.env.MONGO_URI}`);

connectDB();

// Connect to MongoDB using Mongoose
// mongoose.connect(mongoURI)
//   .then(() => console.log('Connected to MongoDB using Mongoose'))
//   .catch((err) => console.error('Could not connect to MongoDB:', err));

const app = express();

// Body Parser Middleware

app.use(express.json());

// Dev Logging Middleware

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount Routes

app.use('/api/v1/bootcamps', bootcamps);

// Middleware

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`.yellow.bold
  );
});

// Handle unhandled rejections

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error : ${err.message}`.red);
  server.close(() => {
    process.exit(1);
  });
});

// Commented required = True in bootcamp schema for user field
