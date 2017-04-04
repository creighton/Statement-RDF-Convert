var actor = require('./actor');

module.exports.convert = function (stmt, writer) {
    writer.addTriple({
        subject: 'https://lrs.adlnet.gov/xapi/statements/' + stmt.id,
        predicate: 'https://w3id.org/xapi#Authority',
        object: actor.getId(stmt.authority)
    });

    actor.convertActor(stmt.authority, writer);
};
