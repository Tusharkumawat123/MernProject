require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const router = require('../src/router/router');
const app = express();
require('./db/conn');
const FormModel = require('./model/model');
const hbs = require('hbs');
const exp = require('constants');
const port = process.env.PORT || 4000;


// Static html path
const html_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../src/templates/views");
const partial_path = path.join(__dirname, "../src/templates/partials");

// this is set for handlerbar template and Html 
hbs.registerPartials(partial_path);
app.use(express.static(html_path));
app.set('view engine', "hbs");
app.set("views", template_path);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(router);


app.listen(port, ()=>{
    console.log(`Server Start on port ${port}`);
})