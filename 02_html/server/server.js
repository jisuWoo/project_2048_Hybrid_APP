const express = require('express');
const app = express();
const port = 3000;

app.get('/hi',hi);
app.listen(port);

function hi(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
    res.send("Lorem, ipsum dolor sit amet consectetur adipisicing elit. Atque, ullam quos! Iste quae,");
}

