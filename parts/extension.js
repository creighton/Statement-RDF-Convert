module.exports.convert = function (subjectid, extobj, writer) {
    for (key in extobj) {
        if (extobj.hasOwnProperty(key)) {
            let val = extobj[key];
            writer.addTriple({
                subject: subjectid,
                predicate: key,
                object: (typeof val === 'string') ? 
                        `"${val}"` : `"${JSON.stringify(val)}"`
            });
        }
    }
};
