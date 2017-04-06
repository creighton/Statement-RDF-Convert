let util = require('../util/util');

module.exports.convert = function (stmt, writer) {
    let verb = stmt.verb;
    // id
    writer.addTriple({
        subject: _s.lrsstmt + stmt.id,
        predicate: _s.xapi + 'verb',
        object: verb.id
    });

//rdfs subproperty
    // optional format
    // writer.addTriple({
    //     subject: _s.lrsstmt + stmt.id,
    //     predicate: verb.id,
    //     object: stmt.object.id || require('./actor').getId(stmt.object)
    // });

    writer.addTriple({
        subject: verb.id,
        predicate: _s.rdf + 'type',
        object: _s.xapi + 'Verb'
    });

    //optional format
    // writer.addTriple({
    //     subject: verb.id,
    //     predicate: _s.rdfs + 'subProperty',
    //     object: _s.xapi + 'Verb'
    // });

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
