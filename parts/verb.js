let util = require('../util/util');

module.exports.convert = function (stmt, writer) {
    let verb = stmt.verb;
    // id
    writer.addTriple({
        subject: 'https://lrs.adlnet.gov/xapi/statements/' + stmt.id,
        predicate: 'https://w3id.org/xapi#Verb',
        object: verb.id
    });

    writer.addTriple({
        subject: verb.id,
        predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
        object: 'https://w3id.org/xapi#Verb'
    });

    if (verb.display) {
        for (let key in verb.display) {
            if (verb.display.hasOwnProperty(key)) {
                writer.addTriple({
                    subject: verb.id,
                    predicate: "https://w3id.org/xapi#display",
                    object: `"${verb.display[key]}"@${key}`
                });
            }
        }
    }
};
