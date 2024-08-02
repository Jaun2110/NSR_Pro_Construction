import express, { Router } from "express"
import { login, renderAdminHome, renderLogin,renderAddUser,addUser,updateRequest,deleteRequest,
    pendingRequests,inProgressRequests,completedRequests, addRequest,renderTestimonials, 
    updateTestimonial,deleteTestimonial,insertTestimonial} from "../controllers/adminController.js"

// setup router
const router = express.Router()
// admin portal home page
router.get("/admin_home", renderAdminHome)
router.get("/portal",renderLogin)
router.post("/login",login)
router.get('/addUser', renderAddUser);
router.post('/newUser', addUser);
router.post("/update-service-request", updateRequest)
router.post("/delete-service-request", deleteRequest)
router.get("/pending_requests",pendingRequests )
router.get("/in_progress",inProgressRequests )
router.get("/completed",completedRequests )
router.get("/newRequest",addRequest)
router.get("/testimonials",renderTestimonials)
// router.get("/projects", renderProjectCarousal)
router.post("/update-testimonial",updateTestimonial)
router.post("/delete-testimonial",deleteTestimonial)
router.post("/insert-testimonial", insertTestimonial)

export default router