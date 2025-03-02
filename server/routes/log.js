import express from "express";
import cors from "cors";
const router = express.Router();

import { bearer, check } from './login.js';
router.use(bearer, check);

// allow CORS with all pre-flight request and POST /log request
router.options("*", cors());

router.post("/", cors(), async function (req, res, next) {
  try {
    console.log(req.body);
    res.send('OK');
  } catch (error) {
    next(error);
  }
});

export { router };
