// Js Script to calculate ETH + TOKEN price for vic
//'use strict'

    const axios =  require('axios')
    const fs = require('fs')
    var http = require('https')
    const ora = require('ora')
    var program = require('commander')

    const baseURL = 'https://api.coinmarketcap.com/v1/ticker&convert=EUR'
    const path = '/Users/VictorBenetatos/Desktop/Assets/'
    const historyFile = `${process.cwd()}/history.txt`
    const hourChange = 'since an hour ago'
    let userCoins
    let availableCurrencies = {}
    
    var file;
    var lastTotal
    var lastDate
    var priceHistory
    var ethPrice

    const rvt = 'https://api.coinmarketcap.com/v1/ticker/rivetz/?convert=EUR'
    const dnt = 'https://api.coinmarketcap.com/v1/ticker/district0x/?convert=EUR'
    const eth = 'https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=EUR'
    const snt = 'https://api.coinmarketcap.com/v1/ticker/status/?convert=EUR'
    const cdt = 'https://api.coinmarketcap.com/v1/ticker/coindash/?convert=EUR'
    const omg = 'https://api.coinmarketcap.com/v1/ticker/omisego/?convert=EUR'
    const zrx = 'https://api.coinmarketcap.com/v1/ticker/0x/?convert=EUR'
    const ada = 'https://api.coinmarketcap.com/v1/ticker/cardano/?convert=EUR'
    
    currentTotal = 0
    

    const amounts = (val) => {
      return val.split(',')
    }

    const getCoinUrl = (symbol) => {
      return `${baseURL}/`
    }

    const fetchCoinInfo = ({coinSymbol, currency = 'USD'}) => {
      var p = new Promise((resolve, reject) => {
        let response;
        axios.get().then(response => {
          resolve(response)
        })
      })
    }

    const getAllCoins = () => {
      var p =  new Promise((resolve, reject) => {
        var data = axios.get('https://api.coinmarketcap.com/v1/ticker/?limit=1500&convert=EUR')
        resolve(data)
      })
     return p
   }

   const readInfoFile = (path) => {
      if(!fs.existsSync(path)) {
        console.log('====================================');
        console.log(`Input file ${path} does not exists`);
        console.log('====================================');
        process.exit()
      } else {
          let data = fs.readFileSync(path,'utf8')
          let contents = data.split('\n')
          let coins = contents[0].split(' ')
          let coinAmounts = contents[1].split(' ')
          if(coins.length !== coinAmounts.length) {
            console.log('====================================');
            console.log('Missmatching info, Make sure the number of coins and amounts is the same, exiting');
            console.log('====================================');
            process.exit()
          }
          let obj = {}
          coins.forEach((coin, index) => {
            obj[coin.toUpperCase()] = parseFloat(coinAmounts[index])
          })
          return obj
        }
  }

  const newLine = () => console.log('\n')

    program.version('0.0.1')
    //.option('-h, --history', 'Convert to your fiat currency')
    .option('-f, --file [file]', 'Provide a text file with two rows. The first has space separated CMC coin Symbols (e.g. eth) and the second the corresponding amount you own', null)
    .parse(process.argv)
    // console.log(program)

    const PrintIt = (coinInfo) => {
      // console.log('=======!!!!===================');
      // console.log(ethPrice);
      // console.log('====================================');
      let sum = 0
      if (userCoins && userCoins.length > 0) {
        console.log(`
        ${ new Date() }
        Your Last result was ${latestEntry}
        `
        )
        newLine()
        userCoins.forEach(coin => {
          const euroPrice = coin.price_eur * coinInfo[coin.symbol]
          sum += euroPrice
          console.log(
            ` ** ${coin.symbol} @ ${coin.price_usd} (${coin.percent_change_1h} since an hour ago) ==> ${euroPrice.toFixed(2)} euro
            `
          )
          newLine()
        })
        var difference = sum-lastTotal
        var upOrDown = difference > 0 ? 'up' : 'down'
        console.log('====================================\n');
        console.log('currentTotal EURO ====>',parseInt(sum) , `${upOrDown} ${difference} euro since ${ msToTime((Date.parse(new Date()) - Date.parse(lastDate) ))} hours ago` )
        console.log('\n====================================');
        console.log('currentTotal ETH ====>', parseFloat(sum/ethPrice).toFixed(2))
        fs.appendFileSync(historyFile,sum.toFixed(2)+ `@${new Date()}`+'\n')
      } else {
      }
    }

    const spinner = ora('Loading Coins And Tokens from CMC...').start()   
    getAllCoins().then(response => {
      let userInfo = undefined
      ethPrice  = parseFloat(response.data.filter(currency => currency.symbol === 'ETH')[0].price_eur).toFixed(2)
      if(program.file) {
        try {
          userInfo = readInfoFile(program.file)
            // console.log('====================================');
            // console.log('userInfo:', userInfo);
            // console.log('====================================');
            response.data.forEach(currency => {
              if (currency.symbol)
                availableCurrencies[currency.symbol] = currency
            })
            userCoins = Object.keys(userInfo).map(coin => {
              return availableCurrencies[coin.toUpperCase()]
            })
            // console.log('====================================');
            // console.log('userCoins:', userCoins);
            // console.log('====================================');
            spinner.stop()            
            PrintIt(userInfo)          
        } catch(err) {
          console.log('errrorrrr', err)
        }
      }
    })


    process.argv.forEach(function (val, index, array) {
      if (val == 'history') {
          fs.readFile(historyFile,'utf8',(error,data)=>{
              priceHistory = data.split('\n')
              console.log('\n')
              console.log(priceHistory)
          })
      }
    });

    if(!fs.existsSync(historyFile)) {
        console.log('====================================');
        console.log('file does not exists, creating it ');
        console.log('====================================');
        fs.writeFileSync(historyFile,'')
        fs.appendFileSync(historyFile,parseInt(0)+ `@${new Date()}`+'\n')
        fs.appendFileSync(historyFile,parseInt(0)+ `@${new Date()}`+'\n')
        fs.appendFileSync(historyFile,parseInt(0)+ `@${new Date()}`+'\n')
        lastTotal = 0
    } else {
      fs.readFile(historyFile,'utf8',(error,data)=>{
          priceHistory = data.split('\n')
          latestEntry = priceHistory[priceHistory.length - 2].split('@')
          lastTotal = latestEntry[0]
          lastDate = new Date(latestEntry[1])

      })
    }
    // fetchCoinInfo({coinSymbol})

// http.get(rvt, function(res){
//     res.setEncoding('utf8');
//     res.on('data', function(chunk){
//         var obj = JSON.parse(chunk)[0]
//         var price = obj.price_eur
//         currentTotal = currentTotal + price * 400 
//         console.log('\n');
//         console.log('RVT @ ' +obj.price_usd +` (${obj.percent_change_1h}% ${hourChange})            =========>`,parseInt(price * 400).toString()+' euro');
//         console.log('\n')
//     });

// })
//     http.get(dnt, function(res){
//         res.setEncoding('utf8');
//         res.on('data', function(chunk){
//             var obj = JSON.parse(chunk)[0]
//             var price = obj.price_eur
//             currentTotal = currentTotal + price * 16800
//             console.log('\n');
//             console.log('DNT @ ' +obj.price_usd +` (${obj.percent_change_1h}% ${hourChange})        =========>`,parseInt(price * 16800).toString()+' euro');
//             console.log('\n')
//         });

//     });
//     http.get(snt, function(res){
//         res.setEncoding('utf8');
//         res.on('data', function(chunk){
//             var obj = JSON.parse(chunk)[0]
//             var price = obj.price_eur
//             currentTotal = currentTotal + price * 12726
//             console.log('\n');
//             console.log('SNT @ ' +obj.price_usd +` (${obj.percent_change_1h}% ${hourChange})        =========>`,parseInt(price * 12726).toString()+' euro');
//             console.log('\n')
//         });

//     });
//     http.get(eth, function(res){
//         res.setEncoding('utf8');
//         res.on('data', function(chunk){
//             var obj = JSON.parse(chunk)[0]
//             var price = obj.price_eur
//             ethPrice = obj.price_eur
//             currentTotal = currentTotal + price * 5.7
//             console.log('\n');
//             console.log('ETH @ ' +obj.price_usd +` (${obj.percent_change_1h}% ${hourChange})        =========>`,parseInt(price * 5.7).toString()+' euro');
//             console.log('\n')
//         });

//     });
//     http.get(zrx, function(res){
//         res.setEncoding('utf8');
//         res.on('data', function(chunk){
//             var obj = JSON.parse(chunk)[0]
//             var price = obj.price_eur
//             currentTotal = currentTotal + price * 800
//             console.log('\n');
//             console.log('ZRX @ ' +obj.price_usd +` (${obj.percent_change_1h}% ${hourChange})        =========>`,parseInt(price * 800).toString()+' euro');
//             console.log('\n')
//         });

//     });

//     setTimeout(function() {
//         var difference = currentTotal-lastTotal
//         var upOrDown = difference > 0 ? 'up' : 'down'
//         console.log('====================================\n');
//         console.log('currentTotal EURO ====>',parseInt(currentTotal) , `${upOrDown} ${difference} euro since ${ msToTime((Date.parse(new Date()) - Date.parse(lastDate) ))} hours ago` )
//         console.log('\n====================================');
//         console.log('currentTotal ETH ====>', parseFloat(currentTotal/ethPrice).toFixed(2))
//         fs.appendFileSync(historyFile,parseInt(currentTotal)+ `@${new Date()}`+'\n')
//     }, 2500);
    
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
