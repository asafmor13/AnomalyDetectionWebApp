const express = require('express')
const fs = require ('fs')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser');
const app = express()
const path = require('path');

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
app.use(express.static("./web_ui"));

 app.get("/", (req,res)=> {
     res.sendFile('./index.html')
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
    console.log(req.body)
    let model = req.files.model;
    let anomaly = req.files.anomaly;


    model.mv('./model.csv', function (err) {
         if (err) {
             res.send(err)
             console.log("here error on modelcsv")
         }
     })


    anomaly.mv('./anomaly.csv', function (err) {
         if (err) {
             res.send(err)
             console.log("problem1")

         } else {
             //console.log("problem2")
             //res.send("file uploaded")
         }
        console.log("manage to finish")
    })
    res.end();
});


app.listen(port, () => console.log('listening on port 8080'));
