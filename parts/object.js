let util = require('../util/util'),
    statement = require('./statement'),
    actor = require('./actor'),
    extension = require('./extension');

let convertActivity = function (object, writer) {
    writer.addTriple({
        subject: object.id,
        predicate: 'https://w3id.org/xapi#objectType',
        object: 'https://w3id.org/xapi#Activity'
    });

    // definition
    if (object.definition) {
        // name
        if (object.definition.name) {
            for (key in object.definition.name) {
                if (object.definition.name.hasOwnProperty(key)) {
                    writer.addTriple({
                        subject: object.id,
                        predicate: 'https://w3id.org/xapi#activityName',
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
                        predicate: 'https://w3id.org/xapi#description',
                        object: `"${object.definition.description[key]}"@${key}`
                    });
                }
            }
        }
        
        // type
        if (object.definition.type) {
            writer.addTriple({
                subject: object.id,
                predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                object: object.definition.type
            });
        }

        // moreInfo
        if (object.definition.moreInfo) {
            writer.addTriple({
                subject: object.id,
                predicate: 'https://w3id.org/xapi#moreInfo',
                object: object.definition.moreInfo
            });
        }

        // skipping interactions

        // extensions
        if (object.definition.extensions) {
            extension.convert(object.id, object.definition.extensions, writer);
        }
    }
};

let objTypeConvert = {
    "Activity": convertActivity,
    "StatementRef": statement.convertStatementRef,
    "SubStatement": statement.convertSubStatement,
    "Agent": actor.convertActor,
    "Group": actor.convertActor
};

module.exports.convert = function (stmt, writer) {
    let object = stmt.object;
    let objType = object.objectType || "Activity";

    // id
    let theid = object.id || actor.getId(object);
    writer.addTriple({
        subject: 'https://lrs.adlnet.gov/xapi/statements/' + stmt.id,
        predicate: 'https://w3id.org/xapi#Object',
        object: theid
    });

    objTypeConvert[objType](object, writer);
};
