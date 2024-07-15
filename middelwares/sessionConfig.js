import env from "dotenv"
env.config()

 const sessionConfig= {
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true, 
    cookie:{
        maxAge :1000 * 60 * 60
    }
}

export default sessionConfig