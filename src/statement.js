function calVolumeCredits(volumeCredits, perf, play) {
  volumeCredits += Math.max(perf.audience - 30, 0);
  if ('comedy' === play.type) volumeCredits += Math.floor(perf.audience / 5);
  return volumeCredits;
}

function calThisAmount(perf, play){
  let thisAmount = 0;
  switch (play.type) {
    case 'tragedy':
      thisAmount = 40000;
      if (perf.audience > 30) {
        thisAmount += 1000 * (perf.audience - 30);
      }
      break;
    case 'comedy':
      thisAmount = 30000;
      if (perf.audience > 20) {
        thisAmount += 10000 + 500 * (perf.audience - 20);
      }
      thisAmount += 300 * perf.audience;
      break;
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
  return thisAmount;
}

function formatToUSD() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;
}

function createStatementData(invoice, plays) {
  let items = {};
  items["customer"] = invoice.customer;
  items["data"] = [];
  let totalAmount = 0;
  let volumeCredits = 0;
  const format = formatToUSD();
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = calThisAmount(perf, play);
    volumeCredits = calVolumeCredits(volumeCredits, perf, play);
    items["data"].push(
        {
          playName: play.name,
          amount: format(thisAmount / 100),
          audience: perf.audience
        }
    );
    totalAmount += thisAmount;
  }
  items["totalAmount"] = format(totalAmount / 100);
  items["volumeCredits"] = volumeCredits;
  return items;
}

function printStatementTXT(items) {
  let result = '';
  result += `Statement for ${items["customer"]}\n`;
  items["data"].map(function (e, index) {
    result += ` ${e.playName}: ${e.amount} (${e.audience} seats)\n`
  })
  result += `Amount owed is ${items["totalAmount"]}\n`;
  result += `You earned ${items["volumeCredits"]} credits \n`;
  return result;
}

function printStatementHTML(items) {
  let result = '';
  result += `<h1>Statement for ${items["customer"]}</h1>\n<table>\n`;
  result += `<tr><th>play</th><th>seats</th><th>cost</th></tr>`;
  items["data"].map(function (e, index) {
    result += ` <tr><td>${e.playName}</td><td>${e.audience}</td><td>${e.amount}</td></tr>\n`
  })
  result += `</table>\n<p>Amount owed is <em>${items["totalAmount"]}</em></p>\n`;
  result += `<p>You earned <em>${items["volumeCredits"]}</em> credits</p>\n`;
  return result;
}

function statement (invoice, plays) {
  let statementData = createStatementData(invoice, plays);
  return printStatementTXT(statementData);
}

function statementHTML (invoice, plays) {
  let statementData = createStatementData(invoice, plays);
  return printStatementHTML(statementData);
}

module.exports = {
  statement, statementHTML,
};
