import env from "dotenv"
import nodemailer from "nodemailer"
env.config()


const transporter = nodemailer.createTransport({
    host: process.env.ETHEREAL_HOST,
    port: process.env.ETHERIAL_PORT,
    auth:{
        user:process.env.ETHEREAL_USER,
        pass:process.env.ETHERIAL_PASSWORD
    }
})

export default transporter

