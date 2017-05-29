var https = require('https');
var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');

var opt = {
    hostname: 'movie.douban.com',
    path: '/cinema/nowplaying/xian/',
    port: 443
};

https.get(opt, function (res) {
    var html = '';
    var movies = [];
    res.setEncoding('utf-8');
    res.on('data', function (chunk) {
        html += chunk;
    });
    res.on('end', function () {
        var $ = cheerio.load(html);
        $('#nowplaying .list-item').each(function () {
            var link = $('.poster a', this).attr('href');
            https.get(link, function(res){
                var html = '';
                res.setEncoding('utf-8');
                res.on('data',function(chunk){
                    html += chunk;
                });
                res.on('end', function (){
                    var $ = cheerio.load(html);
                    var movie = {
                        title: $("[property^='v:itemreviewed']").text(),
                        director:$("[rel^='v:directedBy']").text(),
                        actors:$("[rel^='v:starring']").text(),
                        story:$("[property^='v:summary']").text(),
                    };
                    console.log(movie);
                    saveData(movie);
                    movies.push(movie);
                });
            });
        });
    });
}).on('error', function (err) {
    console.log(err);
});

function saveData(movie){
    var text = JSON.stringify(movie);
    fs.appendFile('./'+movie.title +'.txt',text,'utf-8',function(err){
        if(err){
            return console.log(err);
        }
    });
}
