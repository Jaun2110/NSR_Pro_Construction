import express from "express"
import bodyParser from "body-parser"
import env from "dotenv"
import supabase from "./config/supabaseClient.js"
import passport from "passport"
import session from "express-session"
import transporter from "./config/emailer.js"

const app = express()
const PORT = process.env.PORT || 3000

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

// initialize env variables
env.config()




// ROUTES
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
    // save to db
  const title = req.body.prefix
  const first_name = req.body.firstname
 const last_name = req.body.lastname
 const email = req.body.email
 const cell = req.body.phone
 const address = req.body.street
const suburb = req.body.suburb
 const city = req.body.city
  const zip_code = req.body.zipcode
 const date_from = req.body.dateFrom
 const date_to = req.body.dateTo
const total_bill = req.body.Total
 const requests = req.body.requests
 const days_daily_visits = req.body.daysDailyVisits
const  days_twice_a_day_visits = req.body.daysTwiceADayVisits
 const days_stay_overs = req.body.daysStayOvers
// save data to db
   const insertData = await newServiceRequest(title,first_name,last_name,email,cell,address,suburb,city,zip_code,date_from,date_to,total_bill,requests,days_daily_visits,days_twice_a_day_visits,days_stay_overs)
//   send email
    const mail = await sendMail(title,first_name,last_name,email,cell,address,suburb,city,zip_code,date_from,date_to,total_bill,requests,days_daily_visits,days_twice_a_day_visits,days_stay_overs)
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
async function newServiceRequest(title,first_name,last_name,email,cell,address,suburb,city,zip_code,date_from,date_to,total_bill,requests,days_daily_visits,days_twice_a_day_visits,days_stay_overs){
    const {data, error} = await supabase
    .from('bookings')
    .insert({title,first_name,last_name,email,cell,address,suburb,city,zip_code,date_from,date_to,total_bill,requests,days_daily_visits,days_twice_a_day_visits,days_stay_overs})
    if (error)
        {console.error("Booking insertion failed",error.message)}
    console.log("insertion complete",data)
    return data
}

// email sending
async function sendMail
(title,first_name,last_name,email,cell,address,suburb,
city,zip_code,date_from,date_to,total_bill,requests,days_daily_visits,days_twice_a_day_visits,days_stay_overs){
    const info = await transporter.sendMail({
        from: '"test email"<ramona.satterfield@ethereal.email>',
        to: "jaunn21@gmail.com",
        subject:"NEW BOOKING",
        text:`${first_name} ${last_name} has just placed a booking end needs to be contacted. 
        Details: Firstname: ${first_name}
        Lastname: ${last_name}
        Email address: ${email}
        Cell: ${cell}
        Address: ${address}
        Suburb: ${suburb}
        City: ${city}
        Date From: ${date_from}
        Date To: ${date_to}
        Daily visits: ${days_daily_visits}
        Twice a day visits: ${days_twice_a_day_visits}
        Stay Overs: ${days_stay_overs}
        Special Requests: ${requests}
        Bill Total: ${total_bill}
        `,
        html: `${first_name} ${last_name} has just placed a booking end needs to be contacted. 
        Details: Firstname: ${first_name}
        Lastname: ${last_name}
        Email address: ${email}
        Cell: ${cell}
        Address: ${address}
        Suburb: ${suburb}
        City: ${city}
        Date From: ${date_from}
        Date To: ${date_to}
        Daily visits: ${days_daily_visits}
        Twice a day visits: ${days_twice_a_day_visits}
        Stay Overs: ${days_stay_overs}
        Special Requests: ${requests}
        Bill Total: ${total_bill}
        `
        
    })
    console.log("email sent")
}

app.listen(PORT,'0.0.0.0', ()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})