import supabase from "../config/supabaseClient.js";
import transporter from "../config/emailer.js"
import { getYear } from "../utils/dateUtils.js";
import { name } from "ejs";

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
export const renderAboutPage = (req, res, service) =>{
    const allServices = {
        constructionServices: [
            {name: 'Addition To Home', value: 'Addition To Home'},
            {name: 'New Industrial Building', value: 'New Industrial Building'},
            {name: 'Office Blocks', value: 'Office Blocks'},
            {name: 'Office Renovations', value: 'Office Renovations'},
            {name: 'Residential Complex Housing', value: 'Residential Complex Housing'},
            {name: 'Single Home Project', value: 'Single Home Project'}
        ],
        electricalServices: [
            {name: 'Automated Gates', value: 'Automated Gates'},
            {name: 'Airconditioning & CCTV', value: 'Airconditioning & CCTV'},
            {name: 'Automating Garage Doors', value: 'Automating Garage Doors'},
            {name: 'Earthing & Lightning Protection', value: 'Earthing & Lightning Protection'},
            {name: 'Generator', value: 'Generator'},
            {name: 'Household Appliances', value: 'Household Appliances'},
            {name: 'Inverter Systems', value: 'Inverter Systems'},
            {name: 'Jacuzzi & Pool', value: 'Jacuzzi & Pool'},
            {name: 'Power Saving Analysis', value: 'Power Saving Analysis'}
        ],
        paintingServices: [
            {name: 'House Painting', value: 'House Painting'},
            {name: 'Garage Door Painting', value: 'Garage Door Painting'},
            {name: 'Roof Painting', value: 'Roof Painting'},
            {name: 'Boundary Walls', value: 'Boundary Walls'},
            {name: 'Concrete Spalling Repair', value: 'Concrete Spalling Repair'},
            {name: 'Commercial Painting', value: 'Commercial Painting'},
            {name: 'Wooden Decks', value: 'Wooden Decks'},
            {name: 'Epoxy Floor Painting', value: 'Epoxy Floor Painting'},
            {name: 'High Pressure Cleaning', value: 'High Pressure Cleaning'}
        ],
        plumbingServices: [
            {name: 'Bathroom Renovation', value: 'Bathroom Renovation'},
            {name: 'Storm Water Drainage', value: 'Storm Water Drainage'},
            {name: 'Blockage Removals', value: 'Blockage Removals'},
            {name: 'Hot And Cold Water', value: 'Hot And Cold Water'},
            {name: 'Rain Water Tanks', value: 'Rain Water Tanks'},
            {name: 'Swimming Pool Plumbing', value: 'Swimming Pool Plumbing'},
            {name: 'Sewerage Services', value: 'Sewerage Services'},
            {name: 'Solar Geysers', value: 'Solar Geysers'},
            {name: 'Submersible & Heat Pumps', value: 'Submersible & Heat Pumps'}
        ],
        renovationAndMaintenanceServices: [
            {name: 'Handyman Services', value: 'Handyman Services'},
            {name: 'Carpentry Services', value: 'Carpentry Services'},
            {name: 'Paving Services', value: 'Paving Services'},
            {name: 'Roof Repairs', value: 'Roof Repairs'},
            {name: 'Waterproofing', value: 'Waterproofing'},
            {name: 'Deck Repairs', value: 'Deck Repairs'},
            {name: 'Tiling Services', value: 'Tiling Services'}
        ],
        roofingAndWaterproofingServices: [
            {name: 'Roof Repairs', value: 'Roof Repairs'},
            {name: 'Roof Waterproofing', value: 'Roof Waterproofing'}
        ],
        solarServices: [
            {name: 'Solar Power', value: 'Solar Power'},
            {name: 'Solar Pumps', value: 'Solar Pumps'},
            {name: 'Solar Water Heating', value: 'Solar Water Heating'}
        ]
    };
    
    res.render("aboutpage", {currentYear: getYear(),allServices})
}
export const renderServicePages = (req, res, service) =>{
    res.render(service, {currentYear: getYear()})
}

export const newServiceRequest = async(req,res)=>{
    // console.log(req.body)
    const { firstname, lastname, email, phone, street, suburb, city,
        additionToHome,newIndustrialBuilding,officeBlocks ,officeRenovations,residentialComplexHousing,singeleHomePoject ,
        automatedGates,jacuzziAndPool,earthingAndLightningProtection,automatingGarageDoors,
        airconditioningAndCCTV,powerSavingAnalysis,generator,housholdAppliances,inverterSystems, 
        housePainting,garageDoorPainting,roofPainting,boundryWalls,concreteSpallingRepair,commercialPainting,woodenDecks,epoxyFloorPainting,highPressureCleaning,
        bathroomRenovation,stormWaterDrainage,blockageRemovals,hotAndColdWater,rainWaterTanks,swimmingPoolPlumbing,sewerageServices,solarGeysers,submersibleAndHeatPumps,
        handymanServices,carpentryServices,pavingServices,roofRepairs,waterproofing,deckRepairs,tilingServices,
        roofWaterproofing,
        solarPower,solarPumps,solarWaterHeating
        ,notes
     } = req.body;

    //  create an array for each service category
const constructionServices=[
    {name:'Adition To Home', value : additionToHome || ""},
    {name:'New Industrial Building', value : newIndustrialBuilding  || ""},
    {name:'Office Blocks', value : officeBlocks  || ""},
    {name:'Office Renovations', value : officeRenovations  || ""},
    {name:'Residential ComplexHousing', value : residentialComplexHousing  || ""},
    {name:'Single Home Project', value : singeleHomePoject  || ""}
]
const electricalServices=[
    {name:'Automated Gates', value : automatedGates || ""},
    {name:'Airconditioning & CCTV', value : airconditioningAndCCTV  || ""},
    {name:'Automating Garage Doors', value : automatingGarageDoors  || ""},
    {name:'Earthing & Lightning Protection', value : earthingAndLightningProtection  || ""},
    {name:'Generator', value : generator  || ""},
    {name:'HousholdAppliances', value : housholdAppliances  || ""},
    {name:'Inverter Systems', value : inverterSystems  || ""},
    {name:'Jacuzzi & Pool', value : jacuzziAndPool  || ""},
    {name:'Power Saving Analysis', value : powerSavingAnalysis  || ""}
]
const paintingServices=[
    {name:'House Painting', value : housePainting || ""},
    {name:'Garage Door Painting', value : garageDoorPainting  || ""},
    {name:'Roof Painting', value : roofPainting  || ""},
    {name:'Boundry Walls', value : boundryWalls  || ""},
    {name:'Concrete Spalling Repair', value : concreteSpallingRepair  || ""},
    {name:'Commercial Painting', value : commercialPainting  || ""},
    {name:'Wooden Decks', value : woodenDecks  || ""},
    {name:'Epoxy Floor Painting', value : epoxyFloorPainting  || ""},
    {name:'High Pressure Cleaning', value : highPressureCleaning  || ""}
]
const plumbingServices=[
    {name:'Bathroom Renovation', value : bathroomRenovation || ""},
    {name:'Storm Water Drainage', value : stormWaterDrainage  || ""},
    {name:'Blockage Removals', value : blockageRemovals  || ""},
    {name:'Hot And Cold Water', value : hotAndColdWater  || ""},
    {name:'Rain Water Tanks', value : rainWaterTanks  || ""},
    {name:'Swimming Pool Plumbing', value : swimmingPoolPlumbing  || ""},
    {name:'Sewerage Services', value : sewerageServices  || ""},
    {name:'Solar Geysers', value : solarGeysers  || ""},
    {name:'Submersible & Heat Pumps', value : submersibleAndHeatPumps  || ""}
]
const renovationAndMaintenanceServices=[
    {name:'Handyman Services', value : handymanServices || ""},
    {name:'Carpentry Services', value : carpentryServices  || ""},
    {name:'Paving Services', value : pavingServices  || ""},
    {name:'Roof Repairs', value : roofRepairs  || ""},
    {name:'Waterproofing', value : waterproofing  || ""},
    {name:'Deck Repairs', value : deckRepairs  || ""},
    {name:'Tiling Services', value : tilingServices  || ""}
   
]
const roofingAndWaterproofingServices=[
    {name:'Roof Repairs', value : roofRepairs || ""},
    {name:'Roof Waterproofing', value : roofWaterproofing  || ""},
   
]
const solarServices=[
    {name:'Solar Power', value : solarPower || ""},
    {name:'Solar Pumps', value : solarPumps  || ""},
    {name:'Solar Water Heating', value : solarWaterHeating  || ""},
]


    const allServicesArray =
    [ 
        ...constructionServices,
        ...electricalServices,
        ...paintingServices,
        ...plumbingServices,
       ...renovationAndMaintenanceServices,
        ...roofingAndWaterproofingServices,
        ...solarServices
    ]
       
    ;

    const reqServices = allServicesArray.filter(service => service.value && service.value.trim() !== "").map(service => service.name).join(", ");
    
    console.log(reqServices);
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
// get mail for system/ email adress to send requests to
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
