const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const { host, port, user, pass} = require('../config/mail.json')
const path = require('path')

var transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass }
  });


// console.log(path.resolve(__dirname,"../resources/mail"))

//   transport.use('compile', hbs({
//       extName: '.html',   
//       viewEngine: 'handlebars',
//       viewPath: path.resolve(__dirname,'../resources/mail'),
//       partialsDir: path.resolve(__dirname,'../resources/mail'),
//       layoutsDir: path.resolve(__dirname,'../resources/mail'),
//       defaultLayout: path.resolve('forgot_password')
      
//   }))

  module.exports = transport