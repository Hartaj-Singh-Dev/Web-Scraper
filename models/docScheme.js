import mongoose from "mongoose";

const DocSchema = new mongoose.Schema({
    OrganisationName:{type:String , required:false},
    TownCity:{type:String , required:false},
    Country:{type:String || null || undefined , required:false},
    typeAndRating:{type:String, required:false},
    Route:{type:String , required:false},
    dateProcessed:{type:Date , default:Date.now()}
})

const documentData =  mongoose.model("documentdata" , DocSchema)

export default documentData;