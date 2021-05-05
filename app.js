const joi = require('joi');
const Datastore = require('nedb')
const express = require('express')
const app = express()
const port = 9876;

app.use(express.json());
const database = new Datastore('modeldb.db');
database.loadDatabase();
var modellength = 0;



app.get('/api/models', (req,res) => {
    database.find({}, (err, data) => {
    res.json(data);
    });
});

app.get('/api/model', (req,res) => {

    database.findOne({ model_id: parseInt(req.query.model_id) }, function (err, doc) {
        if(!doc)
            return res.status(404).send('not found');
        res.json(doc);
    });
});

app.get('/api/model/:id', (req,res) => {
    database.findOne({ model_id: parseInt(req.params.id) }, function (err, doc) {
        if(!doc)
            return res.status(404).send('not found');
        res.json(doc.status);
    });
});

app.post('/api/model', (req, res) => {
     if(!req.query.model_type){
        res.status(400).send("no");
    }

    const model = {
        model_id : modellength + 1,
        model_type : req.query.model_type,
        upload_time: new Date().toJSON(),
        status : "pending",
    };

     modellength++;
     database.insert(model);
     res.json(model);

});

app.post('/api/anomaly', (req, res) => {

    database.findOne({ model_id: parseInt(req.query.model_id) }, function (err, doc) {
        if(!doc)
            return res.status(404).send('not found');
        if(doc.status == "pending")
        res.json(doc.status);
    });

});



app.delete('/api/model', (req, res) => {
    database.remove({ model_id: parseInt(req.query.model_id)}, {}, function (err, numRemoved) {
        // numRemoved = 1
        res.json(numRemoved);
    });});

app.listen(port, () => console.log('listening on port 9876'));
