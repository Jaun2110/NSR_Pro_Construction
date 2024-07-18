import bcrypt from "bcrypt"
import supabase from "../config/supabaseClient.js"
import {getYear} from "../utils/dateUtils.js"

// datatable imports

// set saltRounds
const saltRounds =10

export const renderAdminHome = async(req, res) =>{
    if (req.session.user){
// get all service requests and display them on the homepage
        try {
            const {data, error} = await supabase.from('service_requests')
        .select("id, first_name, last_name, email, cell, address, suburb, city, requests ,created_at")
        .order("created_at", {ascending:true})
        
        // convert the time stamp to a date
        let processedData = data.map(row =>({
            ...row,
            date_created: new Date(row.created_at).toISOString().split('T')[0]
           
        }))     
        // console.log(processedData[0]);
        // console.log(processedData[0].date_created); 

        // convert object to string before sending to view
        // processedData = JSON.stringify(processedData)
        res.render("admin_home", {processedData,currentYear:getYear()})      
        } 
        catch (error) {
            console.log("error fetching requests from table",error.message);
        }
           
    }else{
        res.redirect("/admin/portal")
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

//  save updated service request
export const updateRequest = async(req, res) =>{
    const { id, first_name, last_name, email, cell, address, suburb, city, requests } = req.body;
    try {
        const { data, error } = await supabase
            .from('service_requests')
            .update({ first_name, last_name, email, cell, address, suburb, city, requests })
            .eq('id', id);
        
        if (error) throw error;
        
        res.status(200).send({ message: 'Row updated successfully', data });
    } catch (error) {
        res.status(500).send({ message: 'Error updating row', error });
    }
}

// delete request

export const deleteRequest = async(req, res)=>{
    const { id, first_name, last_name, email, cell, address, suburb, city, requests } = req.body;
    // insert tecord into del_service_request table 
    try {
        const {data,error} = await supabase.from("del_service_requests")
        .insert({id, first_name, last_name, email, cell, address, suburb, city, requests})
        
        if (error) {throw error}
        
        res.status(200).send({
            message: 'row inserted to del_service_requests table',
            data})

            // console.log(id);
        // call delRequest 
        delRequest(id,res)
    } catch (error) {
        console.log('Error inserting into del_service_requests table', error.message);

        // send error response
        res.status(500).send({
            message: 'Error inserting into del_service_requests table'
        });
    }
   
    
}

async function delRequest(id,res){
     // delete record from service request table
     try {
        const {data, error} = await supabase.from("service_requests")
        .delete().eq('id',id)
        if (error) {throw error}

        console.log('Row delete successfull');
    } catch (error) {
        console.log('Error deleting record from service_requests table');


    }

} 