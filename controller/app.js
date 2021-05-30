const express = require('express')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser');
const app = express();
const detector = require('../Model/MainModel');
let router = express.Router();
const port = 8080;

//define the app utilities.
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./web_ui"));
app.use('/', router)

//get requset.
 app.get("/", (req,res)=> {
     res.sendFile('./index.html');
});

//initialize a router.


//post request.
router.post('/api/detect', function(req, res, next){
    if(!req.query.model_type){
        res.status(400).send("missing model type")
        return
    }
    let model_type = req.query.model_type;

    if (!req.files.model || !req.files.anomaly) {
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
    } else {
        res.status(400).send("unsupported model type")
    }
});

app.listen(port, () => console.log('listening on port 8080'));

