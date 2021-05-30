const express = require('express')
const fs = require ('fs')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser');
const app = express();
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
console.log('Current directory: ' + process.cwd());

app.get("/", (req,res)=> {
    res.sendFile('./index.html');
});

//create an express router.
let router = express.Router();

//post request.
router.post('/api/detect', function(req, res, next){

    let model_type = req.query.model_type;

    if (!req.files) {
        res.status(400).send("Files are missing.");
        return;
    }
    if(!req.files.model) {
        res.status(400).send("Learn file is missing.");
        return;
    }
    if(!req.files.anomaly) {
        res.status(400).send("Anomaly file is missing.");
        return;
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
    } else {
        res.status(400).send("Unsupported model type.");
    }
});

app.use('/', router)
app.listen(port, () => console.log('listening on port 8080'));