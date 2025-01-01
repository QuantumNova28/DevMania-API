import { readFile } from 'fs/promises';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import colors from 'colors';
import dotenv from 'dotenv';

// Load env variables
dotenv.config({ path: './config/.env' });

// Load models
import Bootcamp from './models/Bootcamp.js';
import Course from './models/Course.js';
import User from './models/User.js';
import Review from './models/Review.js';

// Connect to database

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit the process with failure
  }
};

connectDB();

// Read JSON Files

const __dirname = dirname(fileURLToPath(import.meta.url));
const bootcamps = JSON.parse(
  await readFile(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);
const courses = JSON.parse(
  await readFile(`${__dirname}/_data/courses.json`, 'utf-8')
);
const users = JSON.parse(
  await readFile(`${__dirname}/_data/users.json`, 'utf-8')
);
const reviews = JSON.parse(
  await readFile(`${__dirname}/_data/reviews.json`, 'utf-8')
);

// Import to database
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);
    await Review.create(reviews);
    console.log('Data imported ...'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

// Delete data from database
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data destroyed ...'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
