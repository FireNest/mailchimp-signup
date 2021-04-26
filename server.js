// jshint esversion: 6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const request = require('request');


console.log(process.env.API_KEY);



const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.listen(process.env.PORT || 3000, (req, res) => {
  console.log('app.js is listening on port 3000');
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const fName = (req.body.fName);
  const lName = (req.body.lName);
  const email = (req.body.email);



  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: fName,
          LNAME: lName
        }
      }
    ]
  };


  const jsonData = JSON.stringify(data);

  const URL = 'https://us10.api.mailchimp.com/3.0/lists/a023c19ee4';

  const options = {
    method: 'POST',
    auth: process.env.API_KEY
  }


  const request = https.request(URL, options, response => {
    // console.log(response.statusCode);
    if(response.statusCode === 200) {

      res.sendFile(__dirname + "/success.html");
    }
    else {

      res.sendFile(__dirname + '/failure.html');
    }

      response.on('data', data => {
      console.log(JSON.parse(data));

    })
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure", (req, res) => {
  res.redirect("/");

});

app.post("/success", (req, res) => {
  res.redirect("/");
});
