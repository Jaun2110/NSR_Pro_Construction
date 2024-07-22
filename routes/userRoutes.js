import express from "express"
import { getVideos } from "../controllers/userController.js"

const router = express.Router()


// router.get("/testimonials",getTestimonials)
router.get("/videos", getVideos)

export default router