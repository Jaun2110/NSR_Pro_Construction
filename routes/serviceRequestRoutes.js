import express from "express"

import { renderHomePage, renderAboutPage,renderServicePages, newServiceRequest } from "../controllers/serviceRequestControler.js"
const router = express.Router()

router.get("/", renderHomePage)
router.get("/about", renderAboutPage)
router.get("/electrical", (req,res )=> renderServicePages(req,res,"electrical"))
router.get("/construction", (req,res )=> renderServicePages(req,res,"construction"))
router.get("/renovation_&_maintenance", (req,res )=> renderServicePages(req,res,"renovations_&_maintenance"))
router.get("/painting", (req,res )=> renderServicePages(req,res,"painting"))
router.get("/plumbing", (req,res )=> renderServicePages(req,res,"plumbing"))
// router.get("/property_developments", (req,res )=> renderServicePages(req,res,"painting"))
router.get("/solar", (req,res )=> renderServicePages(req,res,"solar"))
router.get("/roofing_&_waterproofing", (req, res)=> renderServicePages(req, res, "roofing_&_waterproofing"))
router.get('/real_estate',(req, res)=>renderServicePages(req,res,"realEstate"))
router.get('/accounting',(req, res)=>renderServicePages(req,res,"accounting"))
router.post("/newServiceRequest",newServiceRequest)

export default router
