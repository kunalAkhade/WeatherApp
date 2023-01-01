const express=require("express");
const bodyParser=require("body-parser");
const https=require("https");
const { dirname } = require("path");
const { send } = require("process");
const app=express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/',function(get_req,get_res){

    get_res.sendFile(__dirname+"/index.html");
});



app.post('/',function(req,res){
    const city=req.body.cityName;
    let temperature;
    let photo;
    const Info={
        temp:null,
        image:"https://www.shutterstock.com/image-photo/surreal-image-african-elephant-wearing-260nw-1365289022.jpg",
        cityName: city,
        details:null,
        icon:null
    };
    const url="https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=dee4a75669d0db255b1928dd9b426160&units=metric";
    https.get(url,function(response){
        if(!(response.statusCode>=200 && response.statusCode<=299)){
            res.sendFile(__dirname+"/prompt.html");
        }else{
       response.on('data',function(data){
        const weatherData=JSON.parse(data);
        temperature=weatherData.main.temp;
      // res.write("<h1>"+temperature+"</h1>");
      Info.temp=temperature;
      Info.details=weatherData.weather[0].description;
      Info.icon=weatherData.weather[0].icon;
       console.log("Temp");
          
       });

       response.on('end',function(){
         
        const url2="https://api.unsplash.com/search/photos?page=1&query="+city+"&client_id=bkAfXTf03efg1kcDHOsYZRxU1mFaxLsA26A7GEWCKmk";
    https.get(url2,function(response2){
       
        let chunks = [];

       response2.on('data', function(data) {  
  chunks.push(data);
       }).on('close', function() {
  
       let data   = Buffer.concat(chunks);
       let schema = JSON.parse(data);
       photo=schema.results[0].urls.raw;
       Info.image=photo;
       console.log("Photo")
     // res.write("<img  src="+photo+" width='100%' height='100%'>");
     res.render('pages/secondPage',{Info:Info});
       
  
    });
    
    });

       });
       

    }
    });

    

   /* setTimeout(function(){
        res.write("<h1>"+temperature+"</h1>");
        res.write("<img  src="+photo+" width='100%' height='100%'>");
        res.end();
    },3000) */
   
   
    //res.render('pages/secondPage',{Info:Info});
       
});
app.listen(process.env.PORT || 3000,function(){
   console.log("Working");
});


//dee4a75669d0db255b1928dd9b426160