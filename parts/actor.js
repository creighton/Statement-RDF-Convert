let getObjectType = function (actor) {
    return (actor.objectType) ?
            'http://xmlns.com/foaf/0.1/#' + actor.objectType :
            'http://xmlns.com/foaf/0.1/#Agent';
};

// TODO: handle anonymous
// -- sha 1 sum isn't right.. it's a string, can't be a subject later
// -- -- there are places where just a guid is used, or hashed mbox.. we need to give them a scheme.. xapi:..
// -- remove spaces from account.name.. encodeURIComponent?
// -- change objectType to rdf:type?
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
        predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
        object: actorObjectType
    });

    // name
    if (actor.name) {
        writer.addTriple({
            subject: actorid,
            predicate: 'http://xmlns.com/foaf/0.1/#name',
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
    if (actorid == "http://example.com/watch-videoyoutube") console.log(stmt);

    // id
    writer.addTriple({
        subject: 'https://lrs.adlnet.gov/xapi/statements/' + stmt.id,
        predicate: 'https://w3id.org/xapi#Actor',
        object: actorid
    });

    convertActor(actor, writer);
};
