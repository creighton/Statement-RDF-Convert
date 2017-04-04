let util = require('../util/util'),
    _s = require('../util/strings'),
    extension = require('./extension');

let convertScore = function (resultBlank, score, writer) {
    for (let key in score) {
        if (score.hasOwnProperty(key)) {
            writer.addTriple({
                subject: resultBlank,
                predicate: _s.xapi + key,
                object: `"${score[key]}"^^${(key == 'scaled')? _s.xsd + 'decimal': _s.xsd + 'integer'}`
            });
        }
    }
};

module.exports.convert = function (stmt, writer) {
    if (! stmt.result) return;

    let result = stmt.result;
    let resultBlank = util.getBlank();

    // stmt has result
    writer.addTriple({
        subject: _s.lrsstmt + stmt.id,
        predicate: _s.xapi + 'Result',
        object: resultBlank
    });

    // score
    if (result.score) convertScore(resultBlank, result.score, writer);

    if (result.success) {
        writer.addTriple({
            subject: resultBlank,
            predicate: _s.xapi + 'success',
            object: `"${result.success}"^^${_s.xsd}boolean`
        });
    }

    if (result.completion) {
        writer.addTriple({
            subject: resultBlank,
            predicate: _s.xapi + 'completion',
            object: `"${result.completion}"^^${_s.xsd}boolean`
        });
    }

    if (result.response) {
        writer.addTriple({
            subject: resultBlank,
            predicate: _s.xapi + 'response',
            object: `"${result.response}"`
        });
    }

    if (result.duration) {
        writer.addTriple({
            subject: resultBlank,
            predicate: _s.xapi + 'duration',
            object: `"${result.duration}"^^${_s.xsd}duration`
        });
    }

    // extensions
    if (result.extensions) {
        extension.convert(resultBlank, result.extensions, writer);
    }

};
