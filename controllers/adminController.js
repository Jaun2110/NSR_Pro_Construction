import bcrypt from "bcryptjs"
import supabase from "../config/supabaseClient.js"
import {getYear} from "../utils/dateUtils.js"



// set saltRounds
const saltRounds =10

export const renderAdminHome = async(req, res) =>{
    if (req.session.user){
// get all service requests and display them on the homepage
        try {
            const {data, error} = await supabase.from('service_requests')
        .select("id, first_name, last_name, email, cell, address, suburb, city, requests,status,requested_services ,created_at")
        .order("id", {ascending:false})
        
        // convert the time stamp to a date
        let processedData = data.map(row =>({
            ...row,
            date_created: new Date(row.created_at).toISOString().split('T')[0]
           
        }))     
        //  console.log(processedData);
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
    //  console.log(hash)
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
    const { id, first_name, last_name, email, cell, address, suburb, city, requests,status } = req.body;
    try {
        const { data, error } = await supabase
            .from('service_requests')
            .update({ first_name, last_name, email, cell, address, suburb, city, requests,status })
            .eq('id', id);
        
        if (error) throw error;
        
        res.redirect("/admin/admin_home")
    } catch (error) {
        res.status(500).send({ message: 'Error updating row', error });
    }
}

// delete request

export const deleteRequest = async(req, res)=>{
    const { id, first_name, last_name, email, cell, address, suburb, city, requests,status } = req.body;
    // insert tecord into del_service_request table 
    try {
        const {data,error} = await supabase.from("del_service_requests")
        .insert({id, first_name, last_name, email, cell, address, suburb, city, requests, status})
        
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
        res.redirect("/admin/admin_home")
        console.log('Row delete successfull');
    } catch (error) {
        console.log('Error deleting record from service_requests table',error.message);
    }
} 
export const pendingRequests = async(rew, res)=>{
    // retrieve pending reqquests from db
    try {
        const {data, error} = await supabase.from('service_requests')
    .select("id, first_name, last_name, email, cell, address, suburb, city, requests,status ,requested_services,created_at")
    .eq('status','pending')
    .order("created_at", {ascending:false})
    
    // convert the time stamp to a date
    let processedData = data.map(row =>({
        ...row,
        date_created: new Date(row.created_at).toISOString().split('T')[0]
       
    }))     
    //  console.log(processedData);
    
    res.render("pendingRequests", {processedData,currentYear:getYear()})      
    } 
    catch (error) {
        console.log("error fetching requests from table",error.message);
    }
}
export const inProgressRequests = async(rew, res)=>{
    // retrieve pending reqquests from db
    try {
        const {data, error} = await supabase.from('service_requests')
    .select("id, first_name, last_name, email, cell, address, suburb, city, requests,status,requested_services ,created_at")
    .eq('status','in_progress')
    .order("created_at", {ascending:false})
    
    // convert the time stamp to a date
    let processedData = data.map(row =>({
        ...row,
        date_created: new Date(row.created_at).toISOString().split('T')[0]
       
    }))     
    //  console.log(processedData);
    
    res.render("inProgressRequests", {processedData,currentYear:getYear()})      
    } 
    catch (error) {
        console.log("error fetching requests from table",error.message);
    }
}
export const completedRequests = async(req, res)=>{
    // retrieve pending reqquests from db
    try {
        const {data, error} = await supabase.from('service_requests')
    .select("id, first_name, last_name, email, cell, address, suburb, city, requests,status,requested_services ,created_at")
    .eq('status','completed')
    .order("created_at", {ascending:false})
    
    // convert the time stamp to a date
    let processedData = data.map(row =>({
        ...row,
        date_created: new Date(row.created_at).toISOString().split('T')[0]
       
    }))     
    //  console.log(processedData);
    
    res.render("completedRequests", {processedData,currentYear:getYear()})      
    } 
    catch (error) {
        console.log("error fetching requests from table",error.message);
    }
}
export const addRequest = (req, res)=>{
    res.render("newRequest",{currentYear:getYear()})
}

export const renderTestimonials = async(req, res)=>{
    // retrieve pending reqquests from db
    try {
        const {data, error} = await supabase.from('testimonials')
    .select("id, heading, content, created_at")
    .order("id", {ascending:false})
    
    // convert the time stamp to a date
    let processedData = data.map(row =>({
        ...row,
        date_created: new Date(row.created_at).toISOString().split('T')[0]
       
    }))     
    //  console.log(processedData);
    
    res.render("edit_testimonials", {processedData,currentYear:getYear()})      
    } 
    catch (error) {
        console.log("error fetching requests from table",error.message);
    }
}
// insert new testimonial

export const insertTestimonial = async(req, res)=>{
    // res.send("in controller insert testimonial")
    const {heading, content} = req.body
    // inset into testimonial table
    try{
        const {data, error} = await supabase.from("testimonials")
        .insert({heading: heading,
            content: content
        })
        if (error) throw error
        res.redirect("/admin/testimonials")
    }catch(error){
        console.log("Error adding record to table", error.message);
    }
}

//  save updated testimonial
export const updateTestimonial = async(req, res) =>{
    const { id, heading, content} = req.body;
    try {
        const { data, error } = await supabase
            .from('testimonials')
            .update({ heading, content })
            .eq('id', id);
        
        if (error) throw error;
        // on success, redirect to testimonial page
        res.redirect("/admin/testimonials")
    } catch (error) {
        res.status(500).send({ message: 'Error updating row', error });
    }
}

export const deleteTestimonial= async(req, res)=>{
    const { id} = req.body;
    try {
        const {data, error} = await supabase.from("testimonials")
        .delete().eq('id',id)
        if (error) {throw error}
        res.redirect("/admin/testimonials")

        console.log('Row delete successfull');
    } catch (error) {
        console.log('Error deleting record from testimonials table');
    }
}

export const renderCompletedProjects= async(req, res)=>{

    const {data, error} = await supabase.from("project_carousal")
    .select("id,heading,imageurl")

    res.render("edit_completed_projects",{data,currentYear: getYear()})

}

export const addProjectImage = async(req, res)=>{
    const{ heading} = req.body
    const file = req.file
    try
    {
    //    insert file into bucket
        const {data, error} = await supabase.storage.from("project images")
        .upload(file.originalname,file.buffer,{contentType: file.mimetype,})
        if (error) {
            console.log("Bucket upload error:", error.message)
            throw error
          }
          console.log("image upload success");
    
        
        
        // genrate public url for img
        const publicUrl =  supabase.storage.from("project images")
        .getPublicUrl(file.originalname)
        
        // insert record into project_carousal table
        const {data:projectData, error: insertError} =await supabase.from("project_carousal")
        .insert([
            {heading: heading,
             imageurl: publicUrl.data.publicUrl
            }]
        )
        // console.log(publicUrl.data.publicUrl)
        if (insertError) {
            console.log("Database insert error:", insertError.message)
            throw insertError
          }
          console.log("Row insert complete")
        res.redirect("/admin/completed_projects")
    }
    catch(error)
    {
        console.log("Error insering image", error.message);
        res.status(500).send("error inserting image")
    }
}


export const updateProject = async(req, res)=>{
const {id , heading, imageurl} =  req.body

try{
const {data, error} = await supabase.from("project_carousal")
.update({heading})
.eq('id', id)
if(error){throw error}

res.redirect("/admin/completed_projects")
}catch(error){
    res.status(500).send("Error updating row")
}


}

export const deleteProject = async(req, res)=>{
    const {id,header,imageurl} = req.body
    try {
        const {data, error} = await supabase.from("project_carousal")
        .delete().eq('id',id)
        if (error) {throw error}

        console.log('Row delete successfull');
        deleteImgFromBucket(imageurl,res)
        
    } catch (error) {
        console.log('Error deleting record from testimonials table');
    }

}

async function deleteImgFromBucket(imageurl,res){
try {
    const url = new URL(imageurl)
    // split the url into into its parts after each /
    const pathParts = url.pathname.split('/')
    // console.log(pathParts)
    // get the bucketname
    const bucketName = pathParts[5]
    // console.log(`BucketName: ${bucketName}`);
    
    // get the filepath
    const filePath = pathParts.slice(6).join('/')
    // console.log(`filepath :${filePath}`);
    

    const {data, error} = await supabase.storage.from(bucketName)
    .remove([filePath])
    if (error){throw error}
    console.log('bucket file delete successful');
    res.redirect("/admin/completed_projects")
    
    

} catch (error) {
    res.status(500).send("error deleting file",error.message)
}
}
