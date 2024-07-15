import express from "express"
import bodyParser from "body-parser"
import env from "dotenv"
import passport from "passport"
import session from "express-session"
import path from "path"
import { fileURLToPath } from 'url'; // Import fileURLToPath to convert import.meta.url to a path
import sessionConfig from "./middelwares/sessionConfig.js"
import adminRoutes from "./routes/adminRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import serviceRequestRoutes from "./routes/serviceRequestRoutes.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Define __dirname using import.meta.url

// initialize env variables
env.config()
// console.log(process.env)

const app = express()
const PORT = process.env.PORT || 3000

// Set the views directory
app.set('views', path.join(__dirname, 'views'));
// view engine
app.set("view engine", "ejs")

// middelwares
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))
// session setup
app.use(session(sessionConfig))
app.use(passport.initialize())
app.use(passport.session())

// ROUTES
app.use("/", serviceRequestRoutes)
app.use("/admin",adminRoutes)
app.use("/user", userRoutes)

app.listen(PORT,'0.0.0.0', ()=>{
    // production
    console.log(`server running on http://0.0.0.0:${PORT}`)

   
})