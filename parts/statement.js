var util = require('../util/util')
    ,actor = require('./actor')
    ,verb = require('./verb')
    ,object = require('./object')
    ,result = require('./result')
    ,context = require('./context')
    ,authority = require('./authority')
//     ,attachments = require('./attachments')
    ;

var convertParts = function (stmt, writer, substmt) {
    actor.convert(stmt, writer);
    verb.convert(stmt, writer);
    object.convert(stmt, writer);
    result.convert(stmt, writer);
    context.convert(stmt, writer);
    // // substmt = no authority
    if (!substmt) authority.convert(stmt, writer);
    // attachments.convert(stmt, writer);
};

module.exports.convert = function (stmt, writer) {
    // id
    writer.addTriple({
        subject: 'https://lrs.adlnet.gov/xapi/statements/' + stmt.id,
        predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
        object: 'https://w3id.org/xapi#Statement'
    });

    //timestamp
    writer.addTriple({
        subject: 'https://lrs.adlnet.gov/xapi/statements/' + stmt.id,
        predicate: 'https://w3id.org/xapi#timestamp',
        object: `"${stmt.timestamp}"`
    });

    //stored
    writer.addTriple({
        subject: 'https://lrs.adlnet.gov/xapi/statements/' + stmt.id,
        predicate: 'https://w3id.org/xapi#stored',
        object: `"${stmt.stored}"`
    });

    // version
    writer.addTriple({
        subject: 'https://lrs.adlnet.gov/xapi/statements/' + stmt.id,
        predicate: 'https://w3id.org/xapi#version',
        object: `"${stmt.version}"`
    });

    convertParts(stmt, writer, false);
};

module.exports.convertSubStatement = function (stmt, writer) {
    // id
    writer.addTriple({
        subject: util.getBlank(),
        predicate: 'https://w3id.org/xapi#objectType',
        object: 'https://w3id.org/xapi#SubStatement'
    });

    //timestamp
    writer.addTriple({
        subject: 'https://lrs.adlnet.gov/xapi/statements/' + stmt.id,
        predicate: 'https://w3id.org/xapi#timestamp',
        object: `"${stmt.timestamp}"`
    });

    // fix this
    convertParts(stmt, writer, true);
};

module.exports.convertStatementRef = function (stmtref, writer) {
    writer.addTriple({
        subject: stmtref.id,
        predicate: 'https://w3id.org/xapi#objectType',
        object: 'https://w3id.org/xapi#StatementRef'
    });
};
