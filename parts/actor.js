var _s = require('../util/strings');

let getObjectType = function (actor) {
    return (actor.objectType) ?
            _s.foaf + actor.objectType :
            _s.foaf + 'Agent';
};

let getId = function (actor) {
    let id = actor['mbox'] || actor['openid'];
    if (id) return id;

    if (actor['mbox_sha1sum']) return `mbox_sha1sum:${actor['mbox_sha1sum']}`;

    return ( (actor['account'])?
            actor['account']['homePage'] + "#" + encodeURIComponent(actor['account']['name']) :
            "anon:anonymous");
};

module.exports.getId = getId;

// this needs to handle a statement coming in
let convertActor = function (actor, writer) {

    let actorid = getId(actor);
    let actorObjectType = getObjectType(actor);

    // objectType
    writer.addTriple({
        subject: actorid,
        predicate: _s.rdf + 'type',
        object: actorObjectType
    });

    // name
    if (actor.name) {
        writer.addTriple({
            subject: actorid,
            predicate: _s.foaf + 'name',
            object: `"${actor.name}"`
        });
    }

    if (actor.member) {
        for (let i in actor.member) {
            convertActor(actor.member[i], writer);
        }
    }
};
module.exports.convertActor = convertActor;

module.exports.convert = function (stmt, writer) {
    let actor = stmt.actor;
    let actorid = getId(actor);

    // id
    writer.addTriple({
        subject: _s.lrsstmt + stmt.id,
        predicate: _s.xapi + 'Actor',
        object: actorid
    });

    convertActor(actor, writer);
};
