var util = require('../util/util'),
    actor = require('./actor'),
    statement = require('./statement'),
    extension = require('./extension'),
    object = require('./object'),
    _s = require('../util/strings');

var convertContextActivities = function (stmtid, ctxobj, writer) {
    for (key in ctxobj) {
        if (ctxobj.hasOwnProperty(key)) {
            // should have parent, grouping, category or other array of activities
            var caList = ctxobj[key];
            for (idx in caList) {
                // convert activity
                let objectid = caList[idx].id;
                writer.addTriple({
                    subject: _s.lrsstmt + stmtid,
                    predicate: _s.xapi + key,
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
            subject: _s.lrsstmt + stmt.id,
            predicate: _s.xapi + 'registration',
            object: context.registration
        });
    }

    //revision
    if (context.revision) {
        writer.addTriple({
            subject: _s.lrsstmt + stmt.id,
            predicate: _s.xapi + 'revision',
            object: context.revision
        });
    }

    //platform
    if (context.platform) {
        writer.addTriple({
            subject: _s.lrsstmt + stmt.id,
            predicate: _s.xapi + 'platform',
            object: context.platform
        });
    }

    //language
    if (context.language) {
        writer.addTriple({
            subject: _s.lrsstmt + stmt.id,
            predicate: _s.xapi + 'language',
            object: context.language
        });
    }

    // instructor
    if (context.instructor) {
        writer.addTriple({
            subject: _s.lrsstmt + stmt.id,
            predicate: _s.xapi + 'instructor',
            object: actor.getId(context.instructor)
        });

        actor.convertActor(context.instructor, writer);
    }

    // team
    if (context.team) {
        writer.addTriple({
            subject: _s.lrsstmt + stmt.id,
            predicate: _s.xapi + 'team',
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
            subject: _s.lrsstmt + stmt.id,
            predicate: _s.xapi + 'contextStatement',
            object: context.statement.id
        });

        statement.convertStatementRef(context.statement, writer);
    }

    // extensions
    if (context.extensions) {
        extension.convert(_s.lrsstmt + stmt.id, context.extensions, writer);
    }

};
