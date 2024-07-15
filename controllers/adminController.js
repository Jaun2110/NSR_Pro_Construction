import bcrypt from "bcrypt"
import supabase from "../config/supabaseClient.js"
import {getYear} from "../utils/dateUtils.js"

// set saltRounds
const saltRounds =10

export const renderAdminHome = (req, res) =>{
    if (req.session.user){
        res.render("admin_home", {currentYear:getYear()})
    }else{
        res.redirect("admin_login")
    }
}
// render login page get
export const renderLogin = (req, res) => {
    res.render('admin_login', { currentYear: getYear() });
};

// login post request
export const login = (async(req,res)=>{
    const username = req.body.username
    const password = req.body.password
   
       let {data,error} = await supabase
       .from('admin_users')
       .select('*')
       // filter the results where username = username entered
       .eq('username',username) 
       if (error){
           console.log("Error querying database",error.message);
           res.status(500).send("an error occurred while logging in")
           return
       }
     
       if (!data || data.length === 0){
           res.send("Incorrect Username! try again")
           return
       }
       const hash = data[0].password
   
          bcrypt.compare(password, hash, (error,result)=>
           {
               if (error){
                   console.log("Error comparing passwords",error.message);
                   res.status(500).send("an error occured while logging in")
                   // ensure function execution stops when sending mesages
                   return
               }
               if(result){
                   // store username in session
                   req.session.user = username
                //    console.log(req.session)
                   res.redirect("/admin/admin_home")
                  
               }else{
                   res.send("Incorrect password")
               }
           })       
   })

   // render user creation page
//    remeber to give a option for this (button)
export const renderAddUser = (req,res)=>{
    res.render("add_new_user",{currentYear:getYear()})
}

// add new user
export const addUser = async(req, res) =>{
    const username = req.body.username
    const plainTextPassword = req.body.password
 
 //    hash password
 bcrypt.hash(plainTextPassword,saltRounds,async(err,hash)=>{
     console.log(hash)
     if (err){
         console.log("error hashing password",err);
     }
     const password = hash
     // insert hash to db users table
     const {data,error} = await supabase
     .from("admin_users")
     .insert({username,password})
     if(error){
         console.log(`error creating user: ${error.message}`);
     }
     console.log(`User ${username} created`);
 })
 }