import express, { Router } from "express"
// import multer for file upload
import multer from "multer"
import { login, renderAdminHome, renderLogin,renderAddUser,addUser,updateRequest,deleteRequest,
    pendingRequests,inProgressRequests,completedRequests,invoicedRequests, addRequest,renderTestimonials, 
    updateTestimonial,deleteTestimonial,insertTestimonial,renderCompletedProjects,
    addProjectImage,updateProject,deleteProject} 
    from "../controllers/adminController.js"

// setup router
const router = express.Router()
// setup multer
const upload = multer()
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
router.get("/invoiced",invoicedRequests)
router.get("/newRequest",addRequest)
router.get("/testimonials",renderTestimonials)
router.get("/completed_projects", renderCompletedProjects)
router.post("/update-testimonial",updateTestimonial)
router.post("/delete-testimonial",deleteTestimonial)
router.post("/insert-testimonial", insertTestimonial)
router.post("/insert-completed-project",upload.single('filename'),addProjectImage)
router.post("/update-project",updateProject)
router.post("/delete-project",deleteProject)

export default router