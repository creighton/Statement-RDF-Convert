var actor = require('./actor'),
    _s = require('../util/strings');

module.exports.convert = function (stmt, writer) {
    writer.addTriple({
        subject: _s.lrsstmt + stmt.id,
        predicate: _s.xapi + 'Authority',
        object: actor.getId(stmt.authority)
    });

    actor.convertActor(stmt.authority, writer);
};
