const express = require('express')
const fs = require ('fs')
const fileUpload = require('express-fileupload')
const app = express()
app.use(express.static("./web_ui"))
app.use(fileUpload())
app.use(express.json());
const port = 8080;

app.get("/", (req,res)=> {
    //res.sendFile(__dirname + "/" + "style.css");
   // res.sendFile('./index.html', { root: './web_ui' });
    res.sendFile('./main_window.html', { root: './web_ui' });
})

app.post('/detect', (req,res) => {
    if(!req.query.model_type){
        res.status(400).send("no");
    }
    if(req.query.model_type == "hybrid")
        res.send("o")
    if(req.query.model_type == "regression")
        res.send("3o")

});


app.listen(port, () => console.log('listening on port 8080'));
