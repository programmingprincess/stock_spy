
function graphme(dates, dow, prices=[]) {
  var companyChecking = false;
  var stocks = [{
    label: 'S&P 500',
        backgroundColor: window.chartColors.red,
        borderColor: window.chartColors.red,
        data: dow,
        fill: false
  }];

  if (prices.length > 0) {
    companyChecking=true
    stocks.push({
    label: document.getElementById("stockSymbol").value,
        backgroundColor: window.chartColors.blue,
        borderColor: window.chartColors.blue,
        data: prices,
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
        // console.log(xLabel.format('MMM YYYY'));
        // alert("clicked x-axis area: " + xLabel.format('MMM YYYY'));

        var date = dates[date_idx];
        var symbol =  document.getElementById("stockSymbol").value;
        if(companyChecking==true){
          let dowChange = (Math.abs(dow[date_idx-1]-dow[date_idx])/dow[date_idx-1])*100
          let compChange = (Math.abs(prices[date_idx-1]-prices[date_idx])/prices[date_idx-1])*100

          if (Math.abs(dowChange-compChange)<1){
            console.log(Math.abs(dowChange-compChange).toFixed(2));
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
      // tooltips: {
      //   mode: 'index',
      //   intersect: false,
      // },
      // hover: {
      //   mode: 'nearest',
      //   intersect: true
      // },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Adjusted Closing Price ($)',
            fontSize: 15
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
            fontSize: 15
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

  // document.getElementById('randomizeData').addEventListener('click', function() {
  //   config.data.datasets.forEach(function(dataset) {
  //     dataset.data = dataset.data.map(function() {
  //       return randomScalingFactor();
  //     });

  //   });

  //   window.myLine.update();
  // });

  // var colorNames = Object.keys(window.chartColors);
  // document.getElementById('addDataset').addEventListener('click', function() {
  //   var colorName = colorNames[config.data.datasets.length % colorNames.length];
  //   var newColor = window.chartColors[colorName];
  //   var newDataset = {
  //     label: 'Dataset ' + config.data.datasets.length,
  //     backgroundColor: newColor,
  //     borderColor: newColor,
  //     data: [],
  //     fill: false
  //   };

  //   for (var index = 0; index < config.data.labels.length; ++index) {
  //     newDataset.data.push(randomScalingFactor());
  //   }

  //   config.data.datasets.push(newDataset);
  //   window.myLine.update();
  // });

  // document.getElementById('addData').addEventListener('click', function() {
  //   if (config.data.datasets.length > 0) {
  //     var month = MONTHS[config.data.labels.length % MONTHS.length];
  //     config.data.labels.push(month);

  //     config.data.datasets.forEach(function(dataset) {
  //       dataset.data.push(randomScalingFactor());
  //     });

  //     window.myLine.update();
  //   }
  // });

  // document.getElementById('removeDataset').addEventListener('click', function() {
  //   config.data.datasets.splice(0, 1);
  //   window.myLine.update();
  // });

  // document.getElementById('removeData').addEventListener('click', function() {
  //   config.data.labels.splice(-1, 1); // remove the label first

  //   config.data.datasets.forEach(function(dataset) {
  //     dataset.data.pop();
  //   });

  //   window.myLine.update();
  // });  
}
