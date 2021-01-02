// Port website will run on
const PORT = process.env.PORT || 5000
// Initialise Express
const express = require('express')
const app = express()
// Other modules 
require('dotenv').config();
// API keys are stored as env variables 
const configs = require('dotenv').config().parsed
const request = require('request')
const xss = require('xss-clean');
const rateLimit = require("express-rate-limit");

 
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);
 
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
 
// sEcUrItY 
app.use(xss()); // use before routes

// only apply to requests that begin with /api/
app.use("/api/", apiLimiter);


// Render static files
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

// *** GET Routes - display pages ***
// Root Route
app.get('/', function(req, res) {
	res.render('pages/index');
});

// for expression v4.17 and below, use bodyParser 
// app.use(bodyParser.json());
app.use(express.json({ limit: '10kb' })); // limit to prevent overload



app.post('/api/stocks', function (req, res) {
	// Render index page
	if(req.body) {
		var p = req.body // json containing symbol
		var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol='+p.symbol+'&apikey='+configs.STOCKS_API_KEY

	  request(url, function (error, response, body) {
	    // console.log('error:', error); 
	    // console.log('statusCode:', response && response.statusCode); 
	    res.json(body);
	  });
	} else {
		res.sendStatus(400) // error status
	}
});


app.post('/api/news', function (req, res) {

	// make sure we have necessary parameters from client side 
	if(req.body) {
		var p = req.body // already a JSON object at this point
		console.log(p.symbol);
	  var url = 'http://newsapi.org/v2/everything?' +
        'q='+p.symbol+'&' +
        // 'to=2020-01-18&' +
        // 'to=2020-01-18&' +
        'from='+p.date+'&' +
        'to='+p.date+'&' +
        'sortBy=popularity&' +
        'apiKey='+configs.NEWS_API_KEY;

    request(url, function (error, response, body) {
	    // console.log('error:', error); 
	    // console.log('statusCode:', response && response.statusCode); 
	    // console.log('body:', body);
	    res.json(body);
	  });

	} else {
		res.sendStatus(400) // error status
	}

});
