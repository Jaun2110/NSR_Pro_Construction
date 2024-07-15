import express from "express"

import { renderHomePage, renderServicePages, newServiceRequest } from "../controllers/serviceRequestControler.js"
const router = express.Router()

router.get("/", renderHomePage)
router.get("/electrical", (req,res )=> renderServicePages(req,res,"electrical"))
router.get("/maintenance", (req,res )=> renderServicePages(req,res,"maintenance"))
router.get("/newDevelopments", (req,res )=> renderServicePages(req,res,"newDevelopments"))
router.get("/painting", (req,res )=> renderServicePages(req,res,"painting"))
router.get("/plumbing", (req,res )=> renderServicePages(req,res,"plumbing"))
router.get("/renovations", (req,res )=> renderServicePages(req,res,"renovations"))
router.post("/newServiceRequest",newServiceRequest)

export default router
