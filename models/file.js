const mongoose = require("mongoose")

const fileSchema = new mongoose.Schema({
filename:{
    type:String,
    required:true
},
path:{
    type:String,
    required:true
},
size: {
    type:Number,
    required:true
},

uuid:{
    type:String,
    required:true
},
//it is for email thats why not required
sender:{
    type:String,
    required:false
},
receiver:{
    type:String,
    required:false
}
},{
    timestamps:true
})

const File = new mongoose.model("File",fileSchema);

module.exports= File;
