import env from "dotenv"
import nodemailer from "nodemailer"
env.config()

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,  // Your Gmail email address
        pass: process.env.NODEMAILER_PASSWORD  // Your Gmail password or App-Specific Password
    }
    // host: process.env.EXCHANGE_HOST,
    // port: process.env.EXCHANGE_PORT,
    // secure: false, // Set to true if you're using port 465, but usually 587 with TLS is recommended
    // auth: {
    //     user: process.env.EMAIL_USER,  // Your Microsoft Exchange email address
    //     pass: process.env.EMAIL_PASSWORD  // Your email password
    // },
    // tls: {
    //     ciphers: 'SSLv3'  // Optional, sometimes needed for compatibility
    // }
});


export default transporter

