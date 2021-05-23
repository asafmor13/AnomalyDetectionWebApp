const express = require('express')
const fs = require ('fs')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser');
const app = express()
const path = require('path');
const detector = require('../Model/MainModel');
const port = 8080;

app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({
    extended: false
}))
app.use(express.static("./web_ui"));


 app.get("/", (req,res)=> {
     res.sendFile('./main_window.html');
});

app.post('/api/detect', (req,res) => {
    if(!req.query.model_type){
        res.status(400).send("missing model type")
        return
    }
    let model_type = req.query.model_type;
    if (model_type !== "regression" && model_type !== "hybrid") {
        res.status(400).send("unsupported model type")
        return
    }

    //extract the files data
    let model = req.files.model;
    let anomaly = req.files.anomaly;

    //convert them to strings.
    let learnFile = model.data.toString();
    let anomalyFile = anomaly.data.toString();

    //if the post request if for regression,return the anomaly reports as JSON.
    if(model_type === 'regression') {
        res.send(JSON.stringify(detector.simpleActivator(learnFile, anomalyFile)));
    //if its for hybrid.
    } else if(model_type === 'hybrid') {
       res.send(JSON.stringify(detector.hybridActivator(learnFile, anomalyFile)));
    }
    res.end();
});


app.listen(port, () => console.log('listening on port 8080'));
