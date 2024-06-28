const codeModel = require('../models/code.model');
const uniqid = require('uniqid');


const updateCode = async (data) => {
    let filter = {uniqueID: data.codeID};
    let update = {code: data.newCode};
    let updatedCode = await codeModel.findOneAndUpdate(filter, update);
    
    updatedCode = await codeModel.findOne(filter);
}

const shareCode = async (req, res) => {
    let uniqID = uniqid();
    const newCode = new codeModel({
        code: req.body.code,
        lan: req.body.lan,
        uniqueID: uniqID
    });

    await newCode.save();

    res.send({uniqid: uniqID});
}

const getCode = async (req, res) => {
    let codeID = req.params.id;
    let code = await codeModel.find({uniqueID: codeID}).exec();

    if(code.length === 0){
        res.statusCode = 404;
        res.send('Code not found!');
    }
    else{
        res.send(code);
    }
    
}


module.exports = {
    updateCode,
    shareCode,
    getCode,
};