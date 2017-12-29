// helpers
var _ = require('lodash');
var log = require('../core/log.js');

// configuration
var config = require('../core/util.js').getConfig();
// let's create our own method
var method = {};

// prepare everything our method needs
method.init = function() {

  this.name = 'Scalping';
  this.currentTrend;
  this.requiredHistory = config.tradingAdvisor.historySize;
  // define the indicators we need
  var parameters = {short: 5, long: 26, signal: 1};
  this.addIndicator('macd1', 'MACD', parameters);
  var parameters = {short: 5, long: 26, signal: 1};
  this.addIndicator('macd2', 'MACD', parameters);
  var parameters = {short: 14, long: 26, signal: 1};
  this.addIndicator('macd3', 'MACD', parameters);
  this.addIndicator('ema5', 'EMA', 5);
  this.addIndicator('ema14', 'EMA', 14);
  this.addIndicator('ema26', 'EMA', 26);
  
  // initial value
  this.lastLongPrice = 0;
}

// what happens on every new candle?
method.update = function(candle) {
  // nothing!  
}

// for debugging purposes: log the last calculated
method.log = function() {
}

method.check = function() {
  var macd1 = this.indicators.macd1.diff; 
  var macd2 = this.indicators.macd2.diff;
  var macd3 = this.indicators.macd3.diff;
  var ema5 = this.indicators.ema5.result;
  var ema14 = this.indicators.ema14.result;
  var ema26 = this.indicators.ema26.result;


  if(macd1>0 && macd2>0 && macd3>0 && ema5>ema14 && ema5>ema26) {
    this.advice('long');
    // save the long price
    this.lastLongPrice = this.candle.close;
  log.debug('buy price:', this.lastPrice.toFixed(8))
  } 
  
  if(macd1<0 && macd2<0 && macd3<0 && ema5<ema14 && ema5<ema26 && this.candle.close > this.lastLongPrice) {  
    this.advice('short');
  log.debug('sell price:', this.lastPrice.toFixed(8));
  } 
  
}

module.exports = method;
