const FONT_SIZE = 15;

function fetch_stock(data, agg=[]) {
  fetch(STOCKS_API, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(res => {
    // console.log("Request complete! response:", res);
    return res.json()
  }).then(data => {
    var d = JSON.parse(data)
    var series = d["Time Series (Daily)"];
    if (series==undefined) {
      d["Error Message"] == undefined ? // no error message = API limit reached
      document.getElementById("input-error").innerHTML = 'API limit reached. Please try again later.'
      : // error message = stock symbol not found
      document.getElementById("input-error").innerHTML = 'Error: Stock symbol not found.'
    } else {
      dates = [];
      var prices = [];
      for (var time in series) {
        dates.push(time);
        prices.push(series[time]["4. close"]);
      }
      dates = dates.reverse();
      prices = prices.reverse();
      // only retrieve last 30 days due to NEWS API limit 
      // TODO: validation between dates and prices (e.g., what happens if one API is off by a day?)
      dates = dates.slice(70, 100);
      prices = prices.slice(70, 100);

      // we are computing individual STOCK not aggregate
      // this means agg (or dow) is not null  
      if(agg.length > 0) {
        graphme(dates, agg, prices);
      } else { // we are computing SPY or DOW
        graphme(dates, prices);
        dow = prices;
      }
      document.getElementById("input-error").innerHTML = ''; 
    }
  })
}

function graphme(dates, dow, prices=[]){
  var currSymbol = document.getElementById("stockSymbol").value;
  var companyChecking = false;

  // color blind safe palette from color brewer 
  //   #a6cee3
  //   #1f78b4
  //   #b2df8a

  // #ca0020
  // #f4a582
  // #92c5de
  // #0571b0

  const COLOR_ONE = '#a6cee3'
  const COLOR_TWO = '#1f78b4'
  var stocks = [{
    label: 'S&P 500',
        backgroundColor: COLOR_ONE,
        borderColor: COLOR_ONE,
        data: dow,
        yAxisID: 'A',
        fill: false
  }];
  if (prices.length > 0) {
    companyChecking=true
    stocks.push({
    label: currSymbol,
        backgroundColor: COLOR_TWO,
        borderColor: COLOR_TWO,
        data: prices,
        yAxisID: 'B',
        fill: false
    })
  }
  var config = {
    type: 'line',
    data: {
      // labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      labels: dates,
      datasets: stocks,
    },
    options: {
      onClick: function(e) {
        //dataset_idx=myLine.getElementAtEvent(e)[0]._datasetIndex
        date_idx=myLine.getElementAtEvent(e)[0]._index

        var date = dates[date_idx];
        var symbol =  currSymbol;

        // computing variance from S&P
        if(companyChecking==true){
          let dowChange = (Math.abs(dow[date_idx-1]-dow[date_idx])/dow[date_idx-1])*100
          let compChange = (Math.abs(prices[date_idx-1]-prices[date_idx])/prices[date_idx-1])*100

          if (Math.abs(dowChange-compChange)<1){
            document.getElementById("searchInfo").innerHTML=symbol+" Relative Trend: Mimics S&P 500. <br> Showing aggregated stock market news for " +date.toString() ;
            symbol = "MIMIC"
          }
          else{
            var percent=Math.abs(dowChange-compChange).toFixed(2)
            document.getElementById("searchInfo").innerHTML=symbol+" Relative Trend: <b>"+percent+"%</b> difference from S&P 500. <br> Showing news specific to "+symbol+" for "+date.toString() ;
          }

        }
        callNewsAPI(symbol, date);
      },
      responsive: true,
      title: {
        display: true,
        fontSize: 18,
        text: '30-Day Stock Prices'
      },
      tooltips: {
        mode: 'index' // show both lines on hover
      },
      scales: {
        yAxes: [{
          id: 'A',
          position: 'left',
          scaleLabel: {
            display: true,
            labelString: 'Adjusted Closing Price ($): SPY',
            fontSize: FONT_SIZE
          }
        }, 
        {
          id: 'B',
          position: 'right',
          scaleLabel: {
            display: true,
            labelString: 'Adjusted Closing Price ($): ' + currSymbol,
            fontSize: FONT_SIZE
          }
        }],
        xAxes: [{
          ticks: {
              autoSkip: true,
              maxTicksLimit: 8,
              maxRotation: 0,
              minRotation: 0,
          },
          scaleLabel: {
            display: true,
            labelString: 'Date',
            fontSize: FONT_SIZE
          }
        }]
      }    
    }
  };

  var ctx = document.getElementById('canvas').getContext('2d');
  if(window.myLine != undefined) {
    window.myLine.destroy();  
  }
  
  window.myLine = new Chart(ctx, config);
}