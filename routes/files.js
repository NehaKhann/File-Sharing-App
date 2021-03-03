const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const { v4: uuidv4 } = require("uuid");
//basic configuration for multer
let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
//client field name is myFile
let upload = multer({ storage, limits: { fileSize: 1000000 * 100 } }).single(
  "myfile"
); //100mb

router.post("/", (req, res) => {
  //store file
  upload(req, res, async (err) => {
    //validate file
    if (!req.file) {
      return res.json({
        error: "There must be a file",
      });
    }
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    //store file in database // after creating model do it
    const file = new File({
      filename: req.file.filename,
      //we need a package
      uuid: uuidv4(),
      // it is because of multer (destination and filename)
      path: req.file.path,
      size: req.file.size,
    });
    const response = await file.save();
    res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
    //     //!download link looks like this
    //http:localhost:3000/files/uuid
    //we have use uuid so that we can't access other's file because it's unique
  });
});

router.post('/send', async (req, res) => {
  const { uuid, emailTo, emailFrom, expiresIn } = req.body;
  if(!uuid || !emailTo || !emailFrom) {
      return res.status(422).send({ error: 'All fields are required except expiry.'});
  }
  // Get data from db 
  try {
    const file = await File.findOne({ uuid: uuid });
    if(file.sender) {
      return res.status(422).send({ error: 'Email already sent once.'});
    }
    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();
    // send mail
    const sendMail = require('../services/emailService');
    sendMail({
      from: emailFrom,
      to: emailTo,
      subject: 'inShare file sharing',
      text: `${emailFrom} shared a file with you.`,
      html: require('../services/emailTemplate')({
                emailFrom, 
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email` ,
                size: parseInt(file.size/1000) + ' KB',
                expires: '24 hours'
            })
    }).then(() => {
      return res.json({success: true});
    }).catch(err => {
      return res.status(500).json({error: 'Error in email sending.' + err});
    });
} catch(err) {
  return res.status(500).send({ error: 'Something went wrong.' + err});
}

});

module.exports = router;

