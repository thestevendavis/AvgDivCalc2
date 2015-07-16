var limit;

var main = function () {

    $('#SubmitNumberOfStocks').click(function () {
        $('.stocks').html('Stock Ticker:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Number of Shares:');
        limit = parseInt($('#NumberOfStocksTextBox').val());
        if (isNaN(limit) || limit < 1 || limit > 100) {
            $('#Calculate').hide();
            alert('Enter a valid number 1-100');
            }
        else
        {
            var controlCounter = 0;
            while (controlCounter < limit) {
                $('.stocks').append('<br /><input id="StockTextBox' + controlCounter + '" type="text" class="AllTextBoxes start-hidden" /><input id="NumberOfSharesTextBox' + controlCounter + '" type="text" class="AllTextBoxes start-hidden" />');
                controlCounter++;
            }
            $('#Calculate').show('fast');
            $('.AllTextBoxes').show('fast');
        }
    });

    $('#Calculate').click(function () {
        var execute = true;
        var i = 0;
        var stockTickers = "";
        var currentStockTicker = "";
        while (i < limit)
        {
            currentStockTicker = $('#StockTextBox' + i).val();
            if (currentStockTicker.trim() == "") {
                $('#StockTextBox' + i).addClass('highlight');
                alert('Input is required.');
                execute = false;
                break;
            }
            else {
                stockTickers = stockTickers + $('#StockTextBox' + i).val() + ", ";     //leaving an extra ', ' on the end, but yahoo doesn't care
                i++
            }
        }
        if (execute == true) {
            var json = [];
            var url = "https://query.yahooapis.com/v1/public/yql?q=select%20Symbol%2C%20DividendShare%2C%20LastTradePriceOnly%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(\"" + stockTickers + "\")%3B&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys"
            json = getJSON(url);                                           //for actual use
            //var json = getJSON("http://localhost:62551/jsonFile.txt");           //for testing
            var jsonQuotes = json.query.results.quote;
            var itWorked = true;
            var i2 = 0;
            var sumStocks = 0;
            var sumDivs = 0;
            var numberShares;
            while (i2 < limit) {
                numberShares = $('#NumberOfSharesTextBox' + i2).val();
                if (isNaN(numberShares) || numberShares.trim() == "") {
                    $('#NumberOfSharesTextBox' + i2).addClass('highlight');
                    alert('Enter a number of shares for stock: ' + jsonQuotes[i2].Symbol);
                    itWorked = false;
                    break;
                }
                else if (jsonQuotes[i2].LastTradePriceOnly == null) {
                    $('#StockTextBox' + i2).addClass('highlight');
                    alert(jsonQuotes[i2].Symbol + ' is not a valid stock or has no trade price listed.');
                    itWorked = false;
                    break;
                }
                else {
                    sumStocks = sumStocks + jsonQuotes[i2].LastTradePriceOnly * numberShares;
                    sumDivs = sumDivs + jsonQuotes[i2].DividendShare * numberShares;
                    i2++;
                }
            }
            if (itWorked == true) {
                var answer = sumDivs / sumStocks * 100;
                $('.outputArea').html('Your portfolio value is $' + sumStocks.toFixed(2) + ' and pays $' + sumDivs.toFixed(2) + ' in dividends per year. Your portfolio\'s dividend yield is ' + answer.toFixed(2) + '%.');
            }
        }
    });

    //$('#SubmitNumberOfStocks').on('click', '.

    $('.stocks').on('keypress', '.highlight', function () {
        $(this).removeClass('highlight');
    });
}

function getJSON(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('get', theUrl, false);
    xmlHttp.send();
    return JSON.parse(xmlHttp.responseText);
}


$(document).ready(main);