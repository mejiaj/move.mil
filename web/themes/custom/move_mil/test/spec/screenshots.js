// how to use
// browser.saveViewportScreenshot([fileName], [{options}]);
// browser.saveDocumentScreenshot([fileName], [{options}]);
// browser.saveElementScreenshot([fileName], elementSelector, [{options}]);

var browserConfig = require('../../wdio.conf.js');

// console.log(browserConfig.config.testURL)
var gridDetails = browser.getGridNodeDetails();
console.log(gridDetails);

describe('my screenshot', function () {
  it('should capture the page', function () {
    var currentBrowser = browser.desiredCapabilities.browserName;
    var testURL = browserConfig.config.testURL;
    var url= browserConfig.config.baseUrl;
    var today = new Date();
    var date = String(today).replace(/\s/g, '');
    browser.url(url); // place the url you want captured

    browser.saveDocumentScreenshot('./test/screenshots/'+testURL+'_'+currentBrowser+'_'+date+'.png');
  })
})
