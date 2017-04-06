// jason's xapi statement model: https://drive.google.com/file/d/0BxhK5TH2EsphZFBXeVNnSGozWEE/view
var n3 = require('n3'),
    request = require('request'),
    fs = require('fs'),
    statement = require('./parts/statement'),
    _s = require('./util/strings'),
    glob = require('glob'),
    path = require('path'),
    uuid4 = require('uuid/v4');

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

    console.log(sr.statements[0]);
    statement.convert(sr.statements[0], writer);

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
    };

    console.log(`making request to ${options.url}`);
    request(options, callback);
};

var addstuff = function(s) {
    s.id = s.id || uuid4();
    s.version = s.version || "1.0.0";
    s.timestamp = s.timestamp || (new Date()).toISOString();
    s.stored = s.stored || (new Date()).toISOString();
    s.authority = s.authority || {"mbox":"anon@example.com"};
    return s;
};

var loadAllTests = function() {
    glob.sync('./test/statements/**/*.json').forEach(function(file) {
        let stmt = addstuff(require(path.resolve(file)));
        let filename = path.basename(file).split('.')[0];
        convert({"statements":[stmt]}, writer, writeToFile(filename));
    });
};

var loadTest = function (test) {
    var stmtres = {"statements": [addstuff(require(`./test/statements/${test}`))]};
    convert(stmtres, writer, writeToFile(test));
};

var writeToFile = function(filename) {
    return function(sr) {
        console.log(`i think done: ${filename}`);
        writer.end(function (err, res) {
            fs.writeFileSync(`./${filename}.ttl`, res);
        });
    };
};

if (process.argv[2]) {
    if (process.argv[2] == "all") return loadAllTests();
    return loadTest(process.argv[2]);
}
else {
    makeRequest(null, handleStmtResponse);
}
