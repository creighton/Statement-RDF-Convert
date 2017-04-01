let util = require('../util/util'),
    extension = require('./extension');

let convertScore = function (resultBlank, score, writer) {
    for (let key in score) {
        if (score.hasOwnProperty(key)) {
            writer.addTriple({
                subject: resultBlank,
                predicate: 'https://w3id.org/xapi#' + key,
                object: `"${score[key]}"^^${(key == 'scaled')?"http://www.w3.org/2001/XMLSchema#decimal":"http://www.w3.org/2001/XMLSchema#integer"}`
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
        subject: 'https://lrs.adlnet.gov/xapi/statements/' + stmt.id,
        predicate: 'https://w3id.org/xapi#Result',
        object: resultBlank
    });

    // score
    if (result.score) convertScore(resultBlank, result.score, writer);

    if (result.success) {
        writer.addTriple({
            subject: resultBlank,
            predicate: 'https://w3id.org/xapi#success',
            object: `"${result.success}"^^http://www.w3.org/2001/XMLSchema#boolean`
        });
    }

    if (result.completion) {
        writer.addTriple({
            subject: resultBlank,
            predicate: 'https://w3id.org/xapi#completion',
            object: `"${result.completion}"^^http://www.w3.org/2001/XMLSchema#boolean`
        });
    }

    if (result.response) {
        writer.addTriple({
            subject: resultBlank,
            predicate: 'https://w3id.org/xapi#response',
            object: `"${result.response}"`
        });
    }

    if (result.duration) {
        writer.addTriple({
            subject: resultBlank,
            predicate: 'https://w3id.org/xapi#duration',
            object: `"${result.duration}"^^http://www.w3.org/2001/XMLSchema#duration`
        });
    }

    // extensions
    if (result.extensions) {
        extension.convert(resultBlank, result.extensions, writer);
    }

};
