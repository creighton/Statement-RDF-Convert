var util = require('../util/util'),
    actor = require('./actor'),
    statement = require('./statement'),
    extension = require('./extension'),
    object = require('./object');

var convertContextActivities = function (stmtid, ctxobj, writer) {
    for (key in ctxobj) {
        if (ctxobj.hasOwnProperty(key)) {
            // should have parent, grouping, category or other array of activities
            var caList = ctxobj[key];
            for (idx in caList) {
                // convert activity
                let objectid = caList[idx].id;
                writer.addTriple({
                    subject: 'https://lrs.adlnet.gov/xapi/statements/' + stmtid,
                    predicate: 'https://w3id.org/xapi#' + key,
                    object: objectid
                });

                object.convertActivity(caList[idx], writer);
            }
        }
    } // 6819
};

module.exports.convert = function (stmt, writer) {
    // not attaching to anon object, sticking this stuff on the statement
    let context = stmt.context;
    if (! context ) return;

    //registration
    if (context.registration) {
        writer.addTriple({
            subject: 'https://lrs.adlnet.gov/xapi/statements/' + stmt.id,
            predicate: 'https://w3id.org/xapi#registration',
            object: context.registration
        });
    }

    //revision
    if (context.revision) {
        writer.addTriple({
            subject: 'https://lrs.adlnet.gov/xapi/statements/' + stmt.id,
            predicate: 'https://w3id.org/xapi#revision',
            object: context.revision
        });
    }

    //platform
    if (context.platform) {
        writer.addTriple({
            subject: 'https://lrs.adlnet.gov/xapi/statements/' + stmt.id,
            predicate: 'https://w3id.org/xapi#platform',
            object: context.platform
        });
    }

    //language
    if (context.language) {
        writer.addTriple({
            subject: 'https://lrs.adlnet.gov/xapi/statements/' + stmt.id,
            predicate: 'https://w3id.org/xapi#language',
            object: context.language
        });
    }

    // instructor
    if (context.instructor) {
        writer.addTriple({
            subject: 'https://lrs.adlnet.gov/xapi/statements/' + stmt.id,
            predicate: 'https://w3id.org/xapi#instructor',
            object: actor.getId(context.instructor)
        });

        actor.convertActor(context.instructor, writer);
    }

    // team
    if (context.team) {
        writer.addTriple({
            subject: 'https://lrs.adlnet.gov/xapi/statements/' + stmt.id,
            predicate: 'https://w3id.org/xapi#team',
            object: actor.getId(context.team)
        });

        actor.convertActor(context.team, writer);
    }

    // contextActivities
    if (context.contextActivities) {
        convertContextActivities(stmt.id, context.contextActivities, writer);
    }

    // statements
    if (context.statement) {
        writer.addTriple({
            subject: 'https://lrs.adlnet.gov/xapi/statements/' + stmt.id,
            predicate: 'https://w3id.org/xapi#contextStatement',
            object: context.statement.id
        });

        statement.convertStatementRef(context.statement, writer);
    }

    // extensions
    if (context.extensions) {
        extension.convert('https://lrs.adlnet.gov/xapi/statements/' + stmt.id, context.extensions, writer);
    }

};
