var n3 = require('n3'),
    request = require('request'),
    fs = require('fs'),
    statement = require('./parts/statement');

var writer = n3.Writer({
    prefixes: {
        xapi: 'https://w3id.org/xapi#',
        lrsstmt: 'https://lrs.adlnet.gov/xapi/statements/',
        rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        foaf: 'http://xmlns.com/foaf/0.1/#',
        rdfs: 'http://www.w3.org/2000/01/rdf-schema#'
    }
});

var count = 0;

var convert = function (sr, writer, callback) {
    for (var i in sr.statements) {
        statement.convert(sr.statements[i], writer);
    };

    // statement.convert(sr.statements[0], writer);
    // console.log(sr.statements[0]);

    callback(sr);
};

var followMore = function(sr) {
    if (sr.more && sr.more !== "") {
            makeRequest(sr.more, handleStmtResponse);
    } else {
        console.log(`i think done: ${count} statements`);
        writer.end(function (err, res) {
            console.log(fs.writeFileSync('./statemtents.ttl', res));
        });
    }
};

var noMore = function(sr) {
    console.log(`i think done: ${count} statements`);
    writer.end(function (err, res) {
        console.log(fs.writeFileSync('./statemtents.ttl', res));
    });
};

var handleStmtResponse = function (err, res, body) {
    if (err) return console.log('Error: ', err);
    var stmtResult = JSON.parse(body);
    count += stmtResult.statements.length;
    convert(stmtResult, writer, followMore);
    // convert(stmtResult, writer, noMore);
};

var makeRequest = function(more, callback) {
    var options = {
        'url': more ? 'https://lrs.adlnet.gov' + more : 'https://lrs.adlnet.gov/xapi/statements',
        'auth': {
            'user': 'tom',
            'pass': '1234'
        },
        'headers': {
            'X-Experience-API-Version':'1.0.3'
        }
    }

    console.log(`making request to ${options.url}`);
    request(options, callback);
};

makeRequest(null, handleStmtResponse);
