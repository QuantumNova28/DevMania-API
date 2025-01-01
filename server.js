import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import colors from 'colors';
import fileUpload from 'express-fileupload';
import errorHandler from './middleware/error.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
// Solving error on my own by implemeting nonces
import crypto from 'crypto';

// Route Files
import bootcamps from './routes/bootcamps.js';
import courses from './routes/courses.js';
import auth from './routes/auth.js';
import users from './routes/users.js';
import reviews from './routes/reviews.js';

// Load env vars
dotenv.config({ path: './config/.env' });

// Connect to Database
connectDB();

const app = express();

// Body Parser Middleware
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File uploading
app.use(fileUpload());

// Sanitize data
app.use(ExpressMongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());  

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,
});

app.use(limiter);

// Prevent http param population
app.use(hpp());

// Enable CORS
app.use(cors());

// Nonces
app.use((req, res, next) => {
  const nonce = crypto.randomBytes(16).toString('base64');
  res.locals.nonce = nonce; // Save nonce for later use in HTML templates
  res.setHeader(
    'Content-Security-Policy',
    `script-src 'self' 'nonce-${nonce}'`
  );
  next();
});

// Set Static folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount Routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

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

// Commented -----> [required = True] in bootcamp schema for user field
// 9.2 completed GEt single rev and update seeder.. GN
