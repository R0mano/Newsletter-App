const express = require("express");
const bodyParser = require("body-parser");
const request = require("request")
const https = require("https")

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const fName = req.body.firstName;
  const lName = req.body.lastName;
  const email = req.body.email;
  console.log(fName, lName , email);

  const data = {
    members : [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  console.log(jsonData);

  const url = "https://us10.api.mailchimp.com/3.0/lists/**listID**";

  const option = {
    method: "POST",
    auth: "UserName:**APIkey**"
  }

  const request = https.request(url, option, function(response) {
    response.on("data", function(data) {
      console.log(JSON.parse(data));
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    })
  })


  request.write(jsonData);
  request.end();


});

app.post("/failure", function(req, res) {
  res.redirect("/")
});




app.listen(process.env.PORT || 3000, function() {
  console.log("Server running on port 3000.");
});

// APIkey: fdea87e838e262960e5d7c402099afc1-us10
// list id: 65051caade
