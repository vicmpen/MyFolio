// Js Script to calculate ETH + TOKEN price for vic
//'use strict'
(function() {

    var http = require('https')
    var fs = require('fs')
    var path = '/Users/VictorBenetatos/Desktop/Assets'
    var historyFile = '/Users/VictorBenetatos/Desktop/Assets/history.txt'
    var file;
    var lastTotal
    var lastDate
    var priceHistory
    var ethPrice 


    process.argv.forEach(function (val, index, array) {
        if (val == 'history') {
            fs.readFile(historyFile,'utf8',(error,data)=>{
                priceHistory = data.split('\n')
                console.log('\n')
                console.log(priceHistory)
                process.exit()
            })
        }
      });

    if(!fs.existsSync(historyFile)) {
        console.log('====================================');
        console.log('file does not exists, creating it ');
        console.log('====================================');
        fs.writeFileSync(historyFile,'')
        lastTotal = 0
    } else {
        fs.readFile(historyFile,'utf8',(error,data)=>{
            priceHistory = data.split('\n')
            latestEntry = priceHistory[priceHistory.length - 2].split('@')
            lastTotal = latestEntry[0]
            lastDate = new Date(latestEntry[1])

        })
    }


    dnt = 'https://api.coinmarketcap.com/v1/ticker/district0x/?convert=EUR'
    eth = 'https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=EUR',
    snt = 'https://api.coinmarketcap.com/v1/ticker/status/?convert=EUR',
    cdt = 'https://api.coinmarketcap.com/v1/ticker/coindash/?convert=EUR'
    zrx = 'https://api.coinmarketcap.com/v1/ticker//0x/?convert=EUR'

    currentTotal = 0



    http.get(dnt, function(res){
        res.setEncoding('utf8');
        res.on('data', function(chunk){
            var obj = JSON.parse(chunk)[0]
            var price = obj.price_eur
            currentTotal = currentTotal + price * 16800
            console.log('\n');
            console.log('DNT @ ' +obj.price_usd +' =========>',parseInt(price * 16800).toString()+' euro');
            console.log('\n')
        });

    });
    http.get(snt, function(res){
        res.setEncoding('utf8');
        res.on('data', function(chunk){
            var obj = JSON.parse(chunk)[0]
            var price = obj.price_eur
            currentTotal = currentTotal + price * 12726
            console.log('\n');
            console.log('SNT @ ' +obj.price_usd +'=========>',parseInt(price * 12726).toString()+' euro');
            console.log('\n')
        });

    });
    http.get(eth, function(res){
        res.setEncoding('utf8');
        res.on('data', function(chunk){
            var obj = JSON.parse(chunk)[0]
            var price = obj.price_eur
            ethPrice = obj.price_eur
            currentTotal = currentTotal + price * 6
            console.log('\n');
            console.log('ETH @ ' +obj.price_usd +'=========>',parseInt(price * 6).toString()+' euro');
            console.log('\n')
        });

    });
    http.get(zrx, function(res){
        res.setEncoding('utf8');
        res.on('data', function(chunk){
            var obj = JSON.parse(chunk)[0]
            var price = obj.price_eur
            currentTotal = currentTotal + price * 800
            console.log('\n');
            console.log('ZRX @ ' +obj.price_usd +' =========>',parseInt(price * 800).toString()+' euro');
            console.log('\n')
        });

    });

    setTimeout(function() {
        var difference = currentTotal-lastTotal
        var upOrDown = difference > 0 ? 'up' : 'down'
        console.log('====================================\n');
        console.log('currentTotal EURO ====>',parseInt(currentTotal) , `${upOrDown} ${difference} euro since ${ msToTime((Date.parse(new Date()) - Date.parse(lastDate) ))} hours ago` )
        console.log('\n====================================');
        console.log('currentTotal ETH ====>', parseFloat(currentTotal/ethPrice).toFixed(2))
        fs.appendFileSync(historyFile,parseInt(currentTotal)+ `@${new Date()}`+'\n')
    }, 2000);
    
    function msToTime(duration) {
        var milliseconds = parseInt((duration%1000)/100)
            , seconds = parseInt((duration/1000)%60)
            , minutes = parseInt((duration/(1000*60))%60)
            , hours = parseInt((duration/(1000*60*60))%24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    }

})()
