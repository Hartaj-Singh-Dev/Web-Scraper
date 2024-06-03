import axios from 'axios';
import Papa from "papaparse"
export default async function fetchAndCov (csvURL){
    try{
        const response = await axios(csvURL)
        const csvData = response.data

        return new Promise((resolve , reject)=>{
            Papa.parse(csvData , {
                header:true,
                complete:(results)=>{
                    const jsonData = results.data
                    resolve(jsonData)
                },
                error:(error)=>{
                    console.error("error parsing CSV:" , error)
                    reject(error)
                }
            })
        })

    }catch(error){
        console.log("error in fetching CSV file: ", error)
    }
}
