import express from "express"
import bodyParser from "body-parser"
import env from "dotenv"
import supabase from "./config/supabaseClient.js"
import passport from "passport"
import session from "express-session"
import transporter from "./config/emailer.js"
import path from "path"
import { fileURLToPath } from 'url'; // Import fileURLToPath to convert import.meta.url to a path
import { log } from "console"
import { name } from "ejs"

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
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave:false,
        saveUninitialized:true, 
        cookie:{
            maxAge :1000 * 60 * 60
        }
    })
)
app.use(passport.initialize())
app.use(passport.session())


// ROUTES
// Add this route for testing environment variables

app.get("/",(req,res)=>{
    // console.log(supabase)
    
    res.render("homePage",{currentYear: getYear()})
})

app.get("/electrical", (req, res)=> {
    res.render("electrical", {currentYear: getYear()})
})

app.get("/maintanance", (req, res)=> {
    res.render("maintanance", {currentYear: getYear()})
})

app.get("/newDevelopments", (req, res)=> {
    res.render("newDevelopments", {currentYear: getYear()})
})

app.get("/painting", (req, res)=> {
    res.render("painting", {currentYear: getYear()})
})

app.get("/plumbing", (req, res)=> {
    res.render("plumbing", {currentYear: getYear()})
})

app.get("/renovations",(req,res)=>{
    res.render("renovations",{currentYear: getYear()})
})

app.post("/newServiceRequest",async(req,res)=>{
    // console.log(req.body)
    // save to db
 
  const first_name = req.body.firstname
 const last_name = req.body.lastname
 const email = req.body.email
 const cell = req.body.phone
 const address = req.body.street
const suburb = req.body.suburb
 const city = req.body.city
//  checkbox selection
const electricalService = req.body.electrical || " "
const maintananceService = req.body.maintanance|| " "
// value from frontend successfull
const newDevelopmentsService = req.body.new_Developments || " "
const paintingService = req.body.painting || " "
const plumbingService = req.body.plumbing || " "
const renovationService = req.body.renovations || " "
const requests = req.body.notes|| " "

// save data to db
   const insertData = await newServiceRequest(first_name,last_name,email,cell,address,suburb,city
    ,requests)
//   send email
    const mail = await sendMail(first_name,last_name,email,cell,address,suburb,city,
        // checkbox values
    electricalService,maintananceService,newDevelopmentsService,paintingService,plumbingService,renovationService
       , requests)
  res.json({success: true})
})

// ROUTES END

// functions
function getYear(){
    const date = new Date()
    const year = date.getFullYear()
    return year
}
// supabase crud
// add a request
async function newServiceRequest(first_name,last_name,email,cell,address,suburb,city,requests){
    const {data, error} = await supabase
    .from('service_requests')
    .insert({first_name,last_name,email,cell,address,suburb,city,requests})
    if (error)
        {console.error("Request submission to database failed",error.message)}
    console.log("insertion complete",data)
    return data
}

// email sending
async function sendMail(first_name,last_name,email,cell,address,suburb,city,electricalService,maintananceService,newDevelopmentsService,paintingService,plumbingService,renovationService,requests) 
{
    const services = 
    [
        { name: 'Electrical Service', value: electricalService },
        { name: 'Maintanance Service', value: maintananceService },
        { name: 'New Developments Service', value: newDevelopmentsService },
        { name: 'Painting Service', value: paintingService },
        {name:'Plumbing Service', value: plumbingService},
        { name: 'Renovation  Service', value: renovationService }
    ]

    console.log(services);
        const reqServices = 
        // new array with only elements with values
        services.filter(service=>service.value && service.value.trim() !=="")
        // get the service names
        .map(service=> service.name)
        // join them into a comma separated string
        .join(",")
      

      
    const info = await transporter.sendMail({
        from: '"Test Email" <jaunn21@gmail.com>',
        to: "jaunn21@gmail.com",
        subject:   `New Service request from ${first_name} ${last_name}`,
        text: `${first_name} ${last_name} has just placed a service request and needs to be contacted. 
Details:
Firstname: ${first_name}
Lastname: ${last_name}
Email address: ${email}
Cell: ${cell}
Address: ${address}
Suburb: ${suburb}
City: ${city}
Services Requested:
${reqServices}
Notes on what needs to be done: ${requests}
`,
        html: `${first_name} ${last_name} has just placed a service request and needs to be contacted. <br>
<b>Details:</b><br>
<b>Firstname:</b> ${first_name}<br>
<b>Lastname:</b> ${last_name}<br>
<b>Email address:</b> ${email}<br>
<b>Cell:</b> ${cell}<br>
<b>Address:</b> ${address}<br>
<b>Suburb:</b> ${suburb}<br>
<b>City:</b> ${city}<br>
<b>Services Requested:</b><br>
${reqServices.split(', ')}<br>
<b>Notes on what needs to be done:</b><br>
${requests}
`
    });
    console.log("Email sent");
}

app.listen(PORT,'0.0.0.0', ()=>{
    // production
    console.log(`server running on http://0.0.0.0:${PORT}`)

   
})