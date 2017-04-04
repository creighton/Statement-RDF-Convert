let util = require('../util/util'),
    statement = require('./statement'),
    actor = require('./actor'),
    extension = require('./extension'),
    _s = require('../util/strings');

let convertActivity = function (object, writer) {
    let typefound = false;
    // definition
    if (object.definition) {
        // name
        if (object.definition.name) {
            for (key in object.definition.name) {
                if (object.definition.name.hasOwnProperty(key)) {
                    writer.addTriple({
                        subject: object.id,
                        predicate: _s.xapi + 'activityName',
                        object: `"${object.definition.name[key]}"@${key}`
                    });
                }
            }
        }

        // description
        if (object.definition.description) {
            for (key in object.definition.description) {
                if (object.definition.description.hasOwnProperty(key)) {
                    writer.addTriple({
                        subject: object.id,
                        predicate: _s.xapi + 'description',
                        object: `"${object.definition.description[key]}"@${key}`
                    });
                }
            }
        }

        // type
        if (object.definition.type) {
            writer.addTriple({
                subject: object.id,
                predicate: _s.rdf + 'type',
                object: object.definition.type
            });

            writer.addTriple({
                subject: object.definition.type,
                predicate: _s.rdfs + 'subClassOf',
                object: _s.xapi + 'Activity'
            });

            typefound = true;
        }

        // moreInfo
        if (object.definition.moreInfo) {
            writer.addTriple({
                subject: object.id,
                predicate: _s.xapi + 'moreInfo',
                object: object.definition.moreInfo
            });
        }

        // skipping interactions

        // extensions
        if (object.definition.extensions) {
            extension.convert(object.id, object.definition.extensions, writer);
        }
    }

    if (! typefound) {
        writer.addTriple({
            subject: object.id,
            predicate: _s.rdf + 'type',
            object: _s.xapi + 'Activity'
        });
    }
};

module.exports.convertActivity = convertActivity;

module.exports.convert = function (stmt, writer) {
    let objTypeConvert = {
        "Activity": convertActivity,
        "StatementRef": statement.convertStatementRef,
        "SubStatement": statement.convertSubStatement,
        "Agent": actor.convertActor,
        "Group": actor.convertActor
    };

    let object = stmt.object;
    let objType = object.objectType || "Activity";

    // id
    let theid = object.id || actor.getId(object);
    writer.addTriple({
        subject: _s.lrsstmt + stmt.id,
        predicate: _s.xapi + 'Object',
        object: theid
    });

    objTypeConvert[objType](object, writer);
};
