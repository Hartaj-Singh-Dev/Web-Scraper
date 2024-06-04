import express from "express"
const app = express();
import dotenv from "dotenv"
import bodyParser from "body-parser";
import { savetoDb } from "./service/savetoDB.js";
import {getLink }from "./util/getLink.js"
import fetchAndCov from "./util/fetchAndCov.js"
import cors from "cors"


dotenv.config({path:"config.env"})


import connect from "./Database/connect.js"
import extractDatefromURL from "./util/extractDatefromURL.js";

connect(process.env.DATABASE)
const PORT = process.env.SERVER_PORT_ID | 3000




const url = 'https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers';

// async function fetchCSVLink() {
//   try {
//     // Fetch the HTML content of the page
//     const { data } = await axios.get(url);

//     // Load the HTML into cheerio
//     const $ = cheerio.load(data);

//     // Find the link to the CSV file
//     // const link = $('a:contains("CSV")').attr('href');
//    const link =  $('a.govuk-link.gem-c-attachment__link').attr('href');
//     if (link) {
//       // Construct the full URL if the link is relative
//       // const csvUrl = link.startsWith('http') ? link : `https://www.assests.publishing.service.gov.uk/{link}`;
//       const csvUrl = link.startsWith('http') ? link : `https://www.assests.publishing.service.gov.uk${link}`;
//       console.log('CSV Download Link:', csvUrl);
//     } else {
//       console.log('CSV link not found');
//     }
//   } catch (error) {
//     console.error('Error fetching the CSV link:', error);
//   }
// }

app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors({origin:process.env.CLIENT_SITE_LINK || "https://localhost:3000"}))


// Here just running my CRON JOB on TIME
// cron.schedule('30 21 * * 1-5', async () => {
//   console.log('Cron job started at 9:30 PM, Monday to Friday');
  
//   try {
//     // Step 1: Get the CSV link
//     const csvUrl = await getLink();

//     // Step 2: Process the CSV data
//     const jsonData = await fetchAndCov(csvUrl);

//   const difference =   await saveToMongoDB(jsonData);
//   } catch (error) {
//     console.error('Error in cron job:', error);
//   }

//   console.log('Cron job finished');
// });



app.get("/" , (req , res)=>{
    res.send("SERVER is UP and RUNNING !!!")
})

app.get("/getTodayCSV" ,async (req,res)=>{
    const csvURL=  await getLink(url)
    const jsonDate = extractDatefromURL(csvURL)
    const jsonData = await fetchAndCov(csvURL)
    const difference = await savetoDb(jsonData , jsonDate)
    res.status(200).send(jsonData)
    res.status(200).send(difference)
    
})

app.listen(PORT , ()=>{
    console.log(`App Listening on ${PORT}`)
})