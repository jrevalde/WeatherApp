const express = require("express");

//need to include module for making http requests (there are many ways to do so)

//we will use the native https module which is part of the standard node library
const https = require("https");//no need to install this with node because it is native



const app = express();

app.use(express.urlencoded({extended: true})); // used to parse through the body of the post request


app.get("/", function(req, res){
    
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res){
    
    const query = req.body.cityName;
    const api_key = "42a1005cb06a49633bc3d9e7e3b496a7";
    const units = "metric";

    const api_url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + api_key + "&units=" + units; //don't forget the https

    //using the get method of the https module 
    https.get(api_url, function(response){
        console.log(response.statusCode);//you can specify what piece of data you want to extract from the response e.g the status code

        //we can search through the response that we get back and search through it for some data.
        response.on("data", function(data){
            const weatherData = JSON.parse(data);//converts the hexadecimal data into JSON;

            //(JSON.stringify() will turn a javascript object into a string.)

            //Extracting specific data from the JSON (e.g temp)
            const temperature_sydney = weatherData.main.temp; //simply going through the path set in the JSON //this is where the json viewer awesome plugin comes in handy
            const weather_description = weatherData.weather[0].description
            const img_icon = weatherData.weather[0].icon ; //get hold of the icon for the weather data

            const icon_url = "http://openweathermap.org/img/wn/"+ img_icon + "@2x.png";

            console.log(temperature_sydney);
            console.log(weather_description);
            res.write("<p>The weather is currently " + weather_description + "</p>");//can have multiple res.write() unlike res.send()
            res.write("<h1>The temperature in " + query + " is " + temperature_sydney + " degrees celsius.</h1>");// can only have one res.send in any given app methods otherwise it will crash.
            res.write('<img src="'+ icon_url + '">');
            res.send();
        })

        
    });
    
})


    
   
    //res.send("server is up"); have to comment this out or there will be crash


app.listen(3000, function(){
    console.log("live on port 3000");
});

