
function graphme(dates, dow, prices=[]) {
  var stocks = [{
    label: 'S&P 500',
        backgroundColor: window.chartColors.red,
        borderColor: window.chartColors.red,
        data: dow,
        fill: false
  }];

  if (prices.length > 0) {
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

        callNewsAPI(symbol, date);
      },
      responsive: true,
      title: {
        display: true,
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
            labelString: 'Adjusted Closing Price ($)'
          }
        }],
        xAxes: [{
          ticks: {
              autoSkip: true,
              maxTicksLimit: 8,
              maxRotation: 0,
              minRotation: 0
          },
          scaleLabel: {
            display: true,
            labelString: 'Date'
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
