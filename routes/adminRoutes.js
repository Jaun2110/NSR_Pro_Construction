import express, { Router } from "express"
import { login, renderAdminHome, renderLogin,renderAddUser,addUser,updateRequest,deleteRequest } from "../controllers/adminController.js"

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

export default router