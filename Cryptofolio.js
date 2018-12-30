// Js Script to calculate ETH + TOKEN price for vic
//'use strict'

  const axios =  require('axios')
  const fs = require('fs')
  var http = require('https')
  const ora = require('ora')
  var program = require('commander')

  var utils = require('./util')

  const baseURL = 'https://api.coinmarketcap.com/v1/ticker=1500&convert=EUR&limit=200'
  const baseURLv2 = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=600&convert=EUR'
  const path = '/Users/VictorBenetatos/Desktop/Assets/'
  // const historyFile = `${process.cwd()}/history.txt`
  let historyFile = `/history.txt`    
  const hourChange = 'since an hour ago'
  let userCoins
  let availableCurrencies = {}

  const currencyKey = 'EUR'
  
  var file;
  var lastTotal
  var lastDate
  var latestEntry
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
  
  /* Function Implementations */

  const amounts = (val) => {
    return val.split(',')
  }

  const getCoinUrl = (symbol) => {
    return `${baseURL}/`
  }
  // Not used
  process.argv.forEach(function (val, index, array) {
    if (val == 'history') {
        fs.readFile(historyFile,'utf8',(error,data)=>{
            priceHistory = data.split('\n')
            console.log('\n')
            console.log(priceHistory)
        })
    }
  });

  const fetchCoinInfo = ({coinSymbol, currency = 'USD'}) => {
    var p = new Promise((resolve, reject) => {
      let response;
      axios.get().then(response => {
        resolve(response)
      })
    })
  }

  const printBalance = (coinInfo) => {
    // console.log('=======!!!!===================');
    // console.log(ethPrice);
    // console.log('====================================');
    let sum = 0
    if (userCoins && userCoins.length > 0) {
      console.log(`
      ${ new Date() }
      Your Last result was ${latestEntry ? latestEntry : 0}
      `
      )
      newLine()
      userCoins.forEach(coin => {
        const euroPrice = coin.quote[currencyKey].price * coinInfo[coin.symbol]
        sum += euroPrice
        console.log(
          ` ** ${coin.symbol} @ ${coin.quote[currencyKey].price} (${coin.quote[currencyKey].percent_change_1h} since an hour ago) ==> ${euroPrice.toFixed(2)} euro
          `
        )
        newLine()
      })
      var difference = sum-lastTotal
      var upOrDown = difference > 0 ? 'up' : 'down'
      console.log('====================================\n');
      console.log('currentTotal EURO ====>',parseInt(sum) , `${upOrDown} ${difference} euro since ${ utils.msToTime((Date.parse(new Date()) - Date.parse(lastDate) ))} hours ago` )
      console.log('\n====================================');
      console.log('currentTotal ETH ====>', parseFloat(sum/ethPrice).toFixed(2))
      fs.appendFileSync(historyFile,sum.toFixed(2)+ `@${new Date()}`+'\n')
    } else {
    }
  }

  const getAllCoins = () => {
    var p =  new Promise((resolve, reject) => {
      var data = axios.get(baseURLv2,{
        headers : {
          'X-CMC_PRO_API_KEY':'addyouownhere'
        }
      })
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
        let coins = contents[0].split(',')
        let coinAmounts = contents[1].split(',')
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

  const checkFileParameter = (arg) => {
    if(!arg) {
      console.log('No file param provided, ')
      return './crypto.txt'
    }
    return arg
  }

  const newLine = () => console.log('\n')
  /*End Function Implementations */

    !async function start (){
      console.log('lalala')
      let isOnline =  await utils.isOnline()
      console.log(isOnline)
      if (isOnline) {
        console.log('No internet Connection, exiting.')
        process.exit()
      }
    }()

    program.version('0.0.1')
    .option('-f, --file [file]', 'Provide a text file with two rows. The first has comma separated CMC coin Symbols (e.g. eth) and the second the corresponding amount you own', '')
    .parse(process.argv)

    if (!program.file) {
      program.file = './crypto.txt'
      console.log('No Input File was give, defaulting to ./crypto.txt')
      let relativePath = program.rawArgs[1].split('/Cryptofolio.js')[0]
      historyFile = relativePath+historyFile
      utils.checkForFilesExistence(relativePath+'/crypto.txt')
    }
    
    // Check if we are online and exit if not

    newLine()   
    
    // Start spinner, Get all Coins and print user's balance 
    const spinner = ora('Loading Coins And Tokens from CMC...').start()
    newLine()   

    getAllCoins().then(response => {
      let userInfo = undefined
      ethPrice  = parseFloat(response.data.data.filter(currency => currency.symbol === 'ETH')[0].quote[currencyKey].price).toFixed(2)
      if(program.file) {
        try {
          userInfo = readInfoFile(program.file)
          response.data.data.forEach(currency => {
            if (currency.symbol)
              availableCurrencies[currency.symbol] = currency
          })
          userCoins = Object.keys(userInfo).map(coin => {
            console.log(availableCurrencies[coin.toUpperCase()])
            return availableCurrencies[coin.toUpperCase()]
          })
          spinner.stop()            
          printBalance(userInfo)          
        } catch(err) {
          console.log('errrorrrr', err)
        }
      } else {
        newLine()
        console.log(`
            No file was provided, defaulting to ./file.txt
          `)
      }
    })

    if(!fs.existsSync(historyFile)) {
        console.log('====================================');
        console.log('History file does not exists, creating it ');
        console.log('====================================');
        fs.writeFileSync(historyFile,'')
        fs.appendFileSync(historyFile,parseInt(0)+ `@${new Date()}`+'\n')
        lastTotal = 0
    } else {
      fs.readFile(historyFile,'utf8',(error,data)=>{
          priceHistory = data.split('\n')
          if (!priceHistory) {
            lastTotal = 0
            lastDate = new Date()
          } else {
            latestEntry = priceHistory[priceHistory.length-2].split('@')
            lastTotal = latestEntry[0]
            lastDate = new Date(latestEntry[1])
          }
          
      })
    }
