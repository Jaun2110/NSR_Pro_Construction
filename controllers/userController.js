import supabase from "../config/supabaseClient.js";
import { getYear } from "../utils/dateUtils.js";

// render testimonials page
export const getVideos = async(req,res)=>
    {
        // list videos in supabase bucket
        try{
            const {data, error} = await supabase
            .storage
            .from('tetimonial videos')
            .list('')
            // console.log(data)
            if (error) {
                throw error;
              }
            //   console.log(data);
            // generate the public url's for each video in bucket
            // creates new array with all videos
            const videos = data.map(video =>{
                const publicUrl= supabase
                .storage
                .from('tetimonial videos')
                .getPublicUrl(video.name)
                console.log(publicUrl);

                // if(urlError){
                //     console.error("Error generating public URL",error.message)
                // }
                // if no errors return object with video name and public url
                return{
                    name: video.name,
                    url: publicUrl.data.publicUrl
                
                }
            }).filter(video=> video !== null) // filter out any null values
        
             res.render("testimonialVideos",{videos, currentYear:getYear()})
        }    
        catch (error) {
        console.error('Error fetching videos:', error.message);
        res.status(500).send('Error fetching videos');
      }    
    }


    // fetch testimonials

    export const getTestimonials = async(req, res) =>{
       

    }