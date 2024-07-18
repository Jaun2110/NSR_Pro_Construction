import supabase from "../config/supabaseClient.js";
import transporter from "../config/emailer.js"
import { getYear } from "../utils/dateUtils.js";

export const renderHomePage = async(req, res) =>{
// testimonial fetch from db
try
{
const {data, error} = await supabase
.from("testimonials").select("heading, content")

// console.log(data);
const testimonials = data.map(item => {
    return {
        heading: item.heading,
        content: item.content,
    }
    
})
// console.log(testimonials);
res.render("homepage", {testimonials,currentYear: getYear()})

}catch(error){
console.log("Could not fetch testimonials from database", error.message);
}   
}
export const renderServicePages = (req, res, service) =>{
    res.render(service, {currentYear: getYear()})
}

export const newServiceRequest = async(req,res)=>{
    const { firstname, lastname, email, phone, street, suburb, city, electrical, maintenance, new_Developments, painting, plumbing, renovations, notes } = req.body;

    const services = [
        { name: 'Electrical Service', value: electrical || "" },
        { name: 'Maintenance Service', value: maintenance || "" },
        { name: 'New Developments Service', value: new_Developments || "" },
        { name: 'Painting Service', value: painting || "" },
        { name: 'Plumbing Service', value: plumbing || "" },
        { name: 'Renovation Service', value: renovations || "" }
    ];

    const reqServices = services.filter(service => service.value && service.value.trim() !== "").map(service => service.name).join(", ");
    
    const { data, error } = await supabase.from('service_requests').insert({
        first_name: firstname,
        last_name: lastname,
        email,
        cell: phone,
        address: street,
        suburb,
        city,
        requests: notes,
        status:"pending"
    });
    
    if (error) {
        console.error("Request submission to database failed", error.message);
        res.status(500).send('Request submission failed');
        return;
    }
// send email
    const info = await transporter.sendMail({
        from: '"Test Email" <jaunn21@gmail.com>',
        to: "jaunn21@gmail.com",
        subject: `New Service request from ${firstname} ${lastname}`,
        text: `${firstname} ${lastname} has just placed a service request and needs to be contacted. 
Details:
Firstname: ${firstname}
Lastname: ${lastname}
Email address: ${email}
Cell: ${phone}
Address: ${street}
Suburb: ${suburb}
City: ${city}
Services Requested:
${reqServices}
Notes on what needs to be done: ${notes}
`,
        html: `${firstname} ${lastname} has just placed a service request and needs to be contacted. <br>
<b>Details:</b><br>
<b>Firstname:</b> ${firstname}<br>
<b>Lastname:</b> ${lastname}<br>
<b>Email address:</b> ${email}<br>
<b>Cell:</b> ${phone}<br>
<b>Address:</b> ${street}<br>
<b>Suburb:</b> ${suburb}<br>
<b>City:</b> ${city}<br>
<b>Services Requested:</b><br>
${reqServices.split(', ').join('<br>')}<br>
<b>Notes on what needs to be done:</b><br>
${notes}
`
    });
    res.json({ success: true });
};
