const express = require('express')
const fs = require ('fs')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 8080;

app.use(express.urlencoded({
    extended: false
}))
app.use(express.static("web_ui"));

app.get("/", (req,res)=> {
    res.sendFile('./asa.html', { root: './web_ui' });
});

app.post('/api/detect', (req,res) => {
    if(!req.query.model_type){
        res.status(400).send("missing model type")
    }
    let model_type = req.query.model_type;
    if (model_type !== "regression" && model_type !== "hybrid") {
        res.status(400).send("unsupported model type")
    }

    if(!req.files) {
        console.log("no files");
    }
    console.log("files");

    let model = req.learnFile;
    let anomaly = req.detectFile;

    model.mv('./model.csv', function (err) {
        if (err) {
            res.send(err)
        }
        // else {
        //     res.send("file uploaded")
        // }
    })

    anomaly.mv('./anomaly.csv', function (err) {
        if (err) {
            res.send(err)
        } else {
            res.send("file uploaded")
        }
    })
   // res.end();
});


app.listen(port, () => console.log('listening on port 8080'));

