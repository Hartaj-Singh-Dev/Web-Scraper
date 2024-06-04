import documentData from "../models/docScheme.js"
import documentData2 from "../models/docScheme2.js";
import compareData from "./compareData.js";
import comparisonJSONData from "../models/comparisonData.js";


export async function savetoDb (data , jsonDate){
    const keyMapping={
        "Organisation Name":"OrganisationName",
        "Town/City":"TownCity",
        "County":"Country",
        "Type & Rating":"typeAndRating",
        "Route":"Route"
    }


    function transformDataArray(dataArr , mapping){
        return dataArr.map(data=>{
            const transformedData ={};
            for(const key in data){
                if(mapping[key]){
                    transformedData[mapping[key]] = data[key]
                }
            }
            if(transformedData.dateProcessed){
                transformedData.dateProcessed = new Date(transformedData.dateProcessed);

            }else {
                transformedData.dateProcessed = new Date()
            }
            return transformedData;

        })
    }
   
    try{

       const transformedDataArray =  transformDataArray(data, keyMapping)

     const countDocData = await documentData.countDocuments();
     const countDocData2 = await documentData2.countDocuments();

     if(countDocData === 0   && countDocData2 === 0 ){
            await documentData.insertMany(transformedDataArray)
     }
     else if(countDocData > 0 && countDocData2 === 0){
        if(jsonDate === new Date().getDate() ){
            await documentData2.insertMany(transformedDataArray)
            const difference =  compareData(documentData.find(), documentData2.find())
       // Save Difference here in another mongoDB collection  and then send that as result of CLIENT request 
            const DiffDB = new comparisonJSONData(difference)
            await DiffDB.save()
            console.log(DiffDB)
            return difference  
        }else{
          return console.log("Sorry NO updated CSV file available , so no new Data will be saved into DB")
        }  
     }
     else if(countDocData > 0 && countDocData2 > 0){

         const latestDocData = await documentData.findOne().sort({ dateProcessed: -1 });
         const latestDocData2 = await documentData2.findOne().sort({ dateProcessed: -1 });
        const currentDate = new Date();

        const dateDiff1 = Math.abs(currentDate - new Date(latestDocData.dateProcessed))
        const dateDiff2 = Math.abs(currentDate - new Date(latestDocData2.dateProcessed))

        if(dateDiff1 > dateDiff2){
            await documentData.deleteMany({});
            await documentData.insertMany(transformedDataArray)
            const difference = compareData(documentData2 , documentData)
            // Drop the Documents in Older Comparison DB collection and add newone HERE
            comparisonJSONData.deleteMany({})
            const DiffDB = comparisonJSONData(difference)
            await DiffDB.save()
            return difference
        }
        else if (dateDiff1 < dateDiff2){
            await documentData2.deleteMany({});
            await documentData2.insertMany(transformedDataArray)
            const difference = compareData(documentData , documentData2)
            // Drop the Documents in older comparison DB collectiona and add newone HERE
            const DiffDB = comparisonJSONData(difference)
            await DiffDB.save()
            return difference
        }else if(dateDiff1 === dateDiff2){
            console.log("No new Update in CSV file as the date is same")

        }

     }

        console.log("Data Successfully saved to MongoDB")
    }catch(error){
        console.error("Error in Saving Data to MongoDB" , error)
    }
}