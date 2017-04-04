var n3 = require('n3'),
    request = require('request'),
    fs = require('fs'),
    statement = require('./parts/statement'),
    _s = require('./util/strings');

var writer = n3.Writer({
    prefixes: {
        xapi: _s.xapi,
        lrsstmt: _s.lrsstmt,
        rdf: _s.rdf,
        foaf: _s.foaf,
        rdfs: _s.rdfs,
        xsd: _s.xsd
    }
});

var count = 0;

var convert = function (sr, writer, callback) {
    // for (var i in sr.statements) {
    //     statement.convert(sr.statements[i], writer);
    // };

    statement.convert(sr.statements[0], writer);
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
        fs.writeFileSync('./statemtents.ttl', res);
    });
};

var handleStmtResponse = function (err, res, body) {
    if (err) return console.log('Error: ', err);
    var stmtResult = JSON.parse(body);
    count += stmtResult.statements.length;
    // convert(stmtResult, writer, followMore);
    convert(stmtResult, writer, noMore);
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
