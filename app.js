const joi = require('joi');
const express = require('express')
const app = express()
const port = 9876;

app.use(express.json());
const modles = [
    {
        model_id: 1,
        upload_time : "YYYY-MM-DDTHH:mm:ssZ",
        status: "ready"
    }
];

app.get('/', (req,res) => {
    res.status(200).json({
        message: 'hellof world'
    })
});

app.get('/api/models', (req,res) => {
    // res.status(200).json({
    //     message: 'd world'
    // })
    res.send(modles);
});

app.get('/api/model', (req,res) => {
    let model = modles.find(m => m.model_id === parseInt(req.query.model_id));
    if (!model)
        return res.status(404).send('not found');
    res.send(model.status);
});
app.get('/api/model/:id', (req,res) => {

    let model = modles.find(m => m.model_id === parseInt(req.params.id));
    if (!model)
        return res.status(404).send('not found');
     res.send(model);
});

app.post('/api/model', (req, res) => {
    // if(!req.body.name){
    //     res.status(400).send("no");
    // }
    
    const model = {
        model_id : modles.length + 1,
        upload_time: new Date().toJSON(),

        status : "ready",
    };
    modles.push(model);
    res.send(model);

});
app.post('/api/anomaly', (req, res) => {

    let m_id = req.query.model_id;
    console.log(m_id);

    const model = {
        model_id : modles.length + 1,
        upload_time: new Date().toJSON(),

        status : "ready",
    };
    modles.push(model);
    res.send(model);

});



app.delete('/api/model/:id', (req, res) => {
 // implement later
});
app.listen(port, () => console.log('listening on port 9876'));
