import express from 'express';
import dotenv from 'dotenv';
import { Router } from 'express';

import {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  deleteBootcamp,
  updateBootcamp,
  getBootcampInRadius,
  uploadBootcampPhoto,
} from '../controllers/bootcamps.js';

import Bootcamp from '../models/Bootcamp.js';
import advancedResults from '../middleware/advancedResults.js';

// Include other resource routers

import CourseRouter from './courses.js';
import reviewRouter from './reviews.js';

const router = Router();

import { protect, authorize } from '../middleware/auth.js';

// Re-route into other course route
router.use('/:bootcampId/courses', CourseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize('publisher', 'admin'), createBootcamp);

router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), uploadBootcampPhoto);

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

export default router;
