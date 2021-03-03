require("./config/db")
const File = require('./models/file');
const fs = require('fs');

// Get all records older than 24 hours 
async function fetchData() {
 //24 hours in miliseconds
 //1000 ms->1sec
    const files = await File.find({ createdAt : { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000)} })
    if(files.length) {
        for (const file of files) {
            try {
                 //removes file from upload folder
                fs.unlinkSync(file.path);
                //removes file from database
                await file.remove();
                console.log(`successfully deleted ${file.filename}`);
            } catch(err) {
                console.log(`error while deleting file ${err} `);
            }
        }
    }
    console.log('Job done!');
}
// fetchData().then(()=>{
  
//     process.exit();
// })
fetchData().then(process.exit);
