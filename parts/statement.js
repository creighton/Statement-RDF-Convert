var util = require('../util/util')
    ,actor = require('./actor')
    ,verb = require('./verb')
    ,object = require('./object')
    ,result = require('./result')
    ,context = require('./context')
    ,authority = require('./authority')
    ,attachments = require('./attachments')
    ,_s = require('../util/strings')
    ,uuid4 = require('uuid/v4')
    ;

var convertParts = function (stmt, writer, substmt) {
    actor.convert(stmt, writer);
    verb.convert(stmt, writer);
    object.convert(stmt, writer);
    result.convert(stmt, writer);
    context.convert(stmt, writer);
    // // substmt = no authority
    if (!substmt) authority.convert(stmt, writer);
    attachments.convert(stmt, writer);
};

module.exports.convert = function (stmt, writer) {
    // make sure the statement has an id
    stmt.id = stmt.id || uuid4();
    // id
    writer.addTriple({
        subject: _s.lrsstmt + stmt.id,
        predicate: _s.rdf + 'type',
        object: _s.xapi + 'Statement'
    });

    //timestamp
    if (stmt.timestamp) {
        writer.addTriple({
            subject: _s.lrsstmt + stmt.id,
            predicate: _s.lrsstmt + 'timestamp',
            object: `"${stmt.timestamp}"`
        });
    }

    //stored
    if (stmt.stored) {
        writer.addTriple({
            subject: _s.lrsstmt + stmt.id,
            predicate: _s.lrsstmt + 'stored',
            object: `"${stmt.stored}"`
        });
    }

    // version
    if (stmt.version) {
        writer.addTriple({
            subject: _s.lrsstmt + stmt.id,
            predicate: _s.lrsstmt + 'version',
            object: `"${stmt.version}"`
        });
    }

    convertParts(stmt, writer, false);
};

module.exports.convertSubStatement = function (stmt, writer) {
    // id
    writer.addTriple({
        subject: util.getBlank(),
        predicate: _s.lrsstmt + 'objectType',
        object: _s.lrsstmt + 'SubStatement'
    });

    //timestamp
    writer.addTriple({
        subject: _s.lrsstmt + stmt.id,
        predicate: _s.lrsstmt + 'timestamp',
        object: `"${stmt.timestamp}"`
    });

    // fix this
    convertParts(stmt, writer, true);
};

module.exports.convertStatementRef = function (stmtref, writer) {
    writer.addTriple({
        subject: stmtref.id,
        predicate: _s.lrsstmt + 'objectType',
        object: _s.lrsstmt + 'StatementRef'
    });
};
