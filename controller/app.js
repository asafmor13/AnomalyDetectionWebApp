const express = require('express')
const fs = require ('fs')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser');
const app = express()
const path = require('path');
const detector = require('../Model/MainModel');

app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 8080;
app.use(express.urlencoded({
    extended: false
}))

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});
//app.use(express.static());
//app.use(express.static("./web_ui"));
 app.get("/", (req,res)=> {
     //     res.sendFile('./asa.html', {root: __dirname});
     res.sendFile('./main_window.html', {root: '../web_ui'});
});

app.post('/api/detect', (req,res) => {

    if(!req.query.model_type){
        res.status(400).send("missing model type")
        console.log("here error on !model_type")
        return
    }
    let model_type = req.query.model_type;
    if (model_type !== "regression" && model_type !== "hybrid") {
        res.status(400).send("unsupported model type")
        console.log("here error on un supported model_type")
        return
    }

    //extract the files data.
    let model = req.files.model;
    let anomaly = req.files.anomaly;

    //convert them to strings.
    let learnFile = model.data.toString();
    let anomalyFile = anomaly.data.toString();

    //if the post request if for regression,return the anomaly reports as JSON.
    if(model_type === 'regression') {
        return JSON.stringify(detector.simpleActivator(learnFile, anomalyFile));
    //if its for hybrid.
    } else if(model_type === 'hybrid') {
       return JSON.stringify(detector.hybridActivator(learnFile, anomalyFile));
    }
    res.end();
});


app.listen(port, () => console.log('listening on port 8080'));
