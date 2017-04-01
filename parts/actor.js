let getObjectType = function (actor) {
    return (actor.objectType) ?
            'http://xmlns.com/foaf/spec/#' + actor.objectType :
            'http://xmlns.com/foaf/spec/#Agent';
};

let getId = function (actor) {
    return actor['mbox'] || 
           actor['mbox_sha1sum'] || 
           actor['openid'] || 
           actor['account']['homePage'] + "#" + actor['account']['name'];
};

module.exports.getId = getId;

module.exports.convertActor = function (actor, writer) {

    let actorid = this.getId(actor);
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
            predicate: 'http://xmlns.com/foaf/spec/#name',
            object: `"${actor.name}"`
        });
    }

    if (actor.member) {
        for (let i in actor.member) {
            this.convertActor(actor.member[i], writer);
        }
    }
};

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

    this.convertActor(actor, writer);
};
