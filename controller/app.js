const express = require('express')
const fs = require ('fs')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser');
const app = express()
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 8080;

app.use(express.urlencoded({
    extended: false
}))
app.use(express.static("web_ui"));

app.get("/", (req,res)=> {
    res.sendFile('./index.html', { root: './web_ui' });
    // res.sendFile('asa.html', { root: __dirname });
});

app.post('/api/detect', (req,res) => {
    if(!req.query.model_type){
        res.status(400).send("missing model type")
    }
    let model_type = req.query.model_type;
    if (model_type !== "regression" && model_type !== "hybrid") {
        res.status(400).send("unsupported model type")
    }

    if(req.files)
        console.log(req.files);

    let model = req.files.model;
    let anomaly = req.files.anomaly;

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