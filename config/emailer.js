import env from "dotenv"
import nodemailer from "nodemailer"
env.config()

// console.log(process.env.EMAIL_PASSWORD);

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,  // Your Gmail email address
        pass: process.env.NODEMAILER_PASSWORD  // Your Gmail password or App-Specific Password
    }
});



// const transporter = nodemailer.createTransport({
//     host: process.env.ETHEREAL_HOST,
//     port: process.env.ETHERIAL_PORT,
//     auth:{
//         user:process.env.ETHEREAL_USER,
//         pass:process.env.ETHERIAL_PASSWORD
//     }
// })

export default transporter

