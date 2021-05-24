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

 app.get("/", (req,res)=> {
     res.sendFile('./index.html');
});
var router = express.Router();
/*
router.use(function (req, res, next) {
    // .. some logic here .. like any other middleware
    console.log("hey from router")
    try {
        next()
    } catch (e) {
        console.log("next failed with: ")
        console.log(e)
    }
})
 */
/*
router.post('/api/detect', function(req, res, next){
    res.send(JSON.stringify({"data":"value"}));
});
app.use('/', router)
*/
 // app.post('/api/detect', (req,res) => {
router.post('/api/detect', function(req, res, next){
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
    console.log(req.files)
    let model = req.files.model;
    let anomaly = req.files.anomaly;
    //convert them to strings.
    let learnFile = model.data.toString();
    let anomalyFile = anomaly.data.toString();

    //if the post request if for regression,return the anomaly reports as JSON.
    if(model_type === 'regression') {
        console.log(JSON.stringify(detector.simpleActivator(learnFile, anomalyFile)));

        res.send(JSON.stringify(detector.simpleActivator(learnFile, anomalyFile)));
    //if its for hybrid.
    } else if(model_type === 'hybrid') {
        res.send(JSON.stringify(detector.hybridActivator(learnFile, anomalyFile)));
    }
});

app.use('/', router)
app.listen(port, () => console.log('listening on port 8080'));

