const express = require('express')
const bodyParser = require('body-parser')

const app = express()
// Config 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))



require('./src/controllers/authController')(app);
require('./src/controllers/projectsController')(app);

app.listen(3300,console.log('Runing...'))