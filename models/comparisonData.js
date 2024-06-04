import mongoose, { Schema } from "mongoose";

const compareData = new mongoose.Schema({
    dateCompared:{type:Date , default:Date.now},
    added:[{type:Schema.Types.Mixed}],
    removed:[{type: Schema.Types.Mixed}]

})

const comparisonJSONData = mongoose.model("comparisonJSONData" , compareData)

export default comparisonJSONData;