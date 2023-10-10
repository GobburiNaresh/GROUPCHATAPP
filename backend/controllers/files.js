const S3Service = require('../services/S3services');
const GroupFiles = require('../models/shareFiles');
const Message = require('../models/messages');

const downloadFiles = async(req,res,next) => {
    try {
        const file = req.file.buffer;
        const id = req.user.dataValues.id;
        const name = req.user.dataValues.name;
        const groupId = req.params.groupId;
        const fileName = `${req.file.originalname}`

        const fileUrl = await S3Service.uploadToS3(file, fileName);
        console.log("fileUrl",fileUrl);

        const abc = await GroupFiles.create({url: fileUrl, groupId: groupId});
        const msg = await Message.create({message: fileUrl, username: name, userId: id, groupId: groupId})
        res.status(200);
    }
    catch(err){
        console.log(err);
        res.status(500).json({fileUrl:'',success:false,err:err});
    }   
}

module.exports ={
    downloadFiles
}