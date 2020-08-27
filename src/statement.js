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

function statement (invoice, plays) {
  let items = {};
  items["customer"] = invoice.customer;
  items["data"] = [];
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${items["customer"]}\n`;
  const format = formatToUSD();
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = calThisAmount(perf, play);
    volumeCredits = calVolumeCredits(volumeCredits, perf, play);
    //print line for this order
    items["data"].push(
        {
          playName: play.name,
          amount: format(thisAmount / 100),
          audience: perf.audience
        }
    );
    result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
    totalAmount += thisAmount;
  }
  items["totalAmount"] = format(totalAmount / 100);
  items["volumeCredits"] = volumeCredits;
  result += `Amount owed is ${items["totalAmount"]}\n`;
  result += `You earned ${items["volumeCredits"]} credits \n`;
  return result;
}


module.exports = {
  statement,
};

//
// t.is(result, '<h1>Statement for BigCo</h1>\n' +
//     '<table>\n' +
//     '<tr><th>play</th><th>seats</th><th>cost</th></tr>' +
//     ' <tr><td>Hamlet</td><td>55</td><td>$650.00</td></tr>\n' +
//     ' <tr><td>As You Like It</td><td>35</td><td>$580.00</td></tr>\n' +
//     ' <tr><td>Othello</td><td>40</td><td>$500.00</td></tr>\n' +
//     '</table>\n' +
//     '<p>Amount owed is <em>$1,730.00</em></p>\n' +
//     '<p>You earned <em>47</em> credits</p>\n');

function createStatementDate(invoice, plays){
  let items = {};
  items["customer"] = invoice.customer;
  items["data"] = [];
  console.log(items)
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
  items["totalAmount"] = totalAmount;
  items["volumeCredits"] = volumeCredits;
  console.log(items)
  return items
}