let util = require('../util/util');

module.exports.convert = function (stmt, writer) {
    let verb = stmt.verb;
    // id
    writer.addTriple({
        subject: _s.lrsstmt + stmt.id,
        predicate: _s.xapi + 'Verb',
        object: verb.id
    });

    writer.addTriple({
        subject: verb.id,
        predicate: _s.rdf + 'type',
        object: _s.xapi + 'Verb'
    });

    if (verb.display) {
        for (let key in verb.display) {
            if (verb.display.hasOwnProperty(key)) {
                writer.addTriple({
                    subject: verb.id,
                    predicate: _s.xapi + 'display',
                    object: `"${verb.display[key]}"@${key}`
                });
            }
        }
    }
};
