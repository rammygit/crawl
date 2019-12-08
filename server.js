const siteUrl = "https://en.wikipedia.org/wiki/Chennai";
const axios = require("axios");
const cheerio = require("cheerio");

const PORT = process.env.PORT || 5500;

const fetchData = async () => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};

const extract = async (res) => {

    let text = [{name:'',url:''}]
    const $ = await fetchData();

    //fetch all <a> tags and filter on conditions 
    let filteredEls = $('a').filter(function (i, el) {
        
        return $(this).text().length > 2 && 
                !$(this).text().includes('[') && 
                !$(this).text().includes('listen') && 
                typeof $(this).attr('href')  !== 'undefined' && 
                !$(this).attr('href').includes('#') && 
                !$(this).attr('href').includes('Help:IPA')
    });

    // on the filtered elements, get the array of name and url. 
    filteredEls.each(function (i, e) {
        
        text.push({
            name : $(this).text(),
            url : $(this).attr('href')
        })


    });

    // console.log(text)

    

    res.send(text.slice(0, 100))




}




const express=require('express');
const app=express();
const cors = require('cors');

app.use(cors())

app.get('/',function(req,res)
{
    res.send('Hello World!');
});

app.get('/parse',function(req,res)
{
     extract(res);
    
});


app.listen(PORT,function() {
    console.log(`App Started....Listening at ${PORT}`)
});

// extract();







