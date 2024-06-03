import axios from 'axios';
import * as cheerio from 'cheerio';

 export async function getLink (url){
   try {
    // Fetch the HTML content of the page
    const { data } = await axios.get(url);

    // Load the HTML into cheerio
    const $ = cheerio.load(data);

    // Find the link to the CSV file
    // const link = $('a:contains("CSV")').attr('href');
   const link =  $('a.govuk-link.gem-c-attachment__link').attr('href');
    if (link) {
      // Construct the full URL if the link is relative
      // const csvUrl = link.startsWith('http') ? link : `https://www.assests.publishing.service.gov.uk/{link}`;
      const csvUrl = link.startsWith('http') ? link : `https://www.assests.publishing.service.gov.uk${link}`;
    console.log('Got CSV Download Link' , csvUrl);
      return csvUrl
      
    } else {
      console.log('CSV link not found');
    }
  } catch (error) {
    console.error('Error fetching the CSV link:', error);
  } 
}
