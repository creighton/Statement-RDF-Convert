var util = require('../util/util')
    _s = require('../util/strings');

module.exports.convert = function (stmt, writer) {
    if (! stmt.attachments) return;

    for (idx in stmt.attachments) {
        let att = stmt.attachments[idx];
        let attid = util.getBlank();

        writer.addTriple({
            subject: _s.lrsstmt + stmt.id,
            predicate: _s.xapi + 'attachment',
            object: attid
        });

        // usageType - require
        writer.addTriple({
            subject: attid,
            predicate: _s.xapi + 'usageType',
            object: att.usageType
        });

        // display - require - langmap
        if (att.display) {
            for (let key in att.display) {
                if (att.display.hasOwnProperty(key)) {
                    writer.addTriple({
                        subject: attid,
                        predicate: _s.xapi + 'display',
                        object: `"${att.display[key]}"@${key}`
                    });
                }
            }
        }

        // description - options - langmap
        if (att.description) {
            if (att.description.hasOwnProperty(key)) {
                writer.addTriple({
                    subject: attid,
                    predicate: _s.xapi + 'description',
                    object: `"${att.description[key]}"@${key}`
                });
            }
        }

        // contentType - require
        writer.addTriple({
            subject: attid,
            predicate: _s.xapi + 'contentType',
            object: att.contentType
        });

        // length - require
        writer.addTriple({
            subject: attid,
            predicate: _s.xapi + 'length',
            object: att.length
        });

        // sha2 - require
        writer.addTriple({
            subject: attid,
            predicate: _s.xapi + 'sha2',
            object: att.sha2
        });

        // fileUrl - options
        if (att.fileUrl) {
            writer.addTriple({
                subject: attid,
                predicate: _s.xapi + 'fileUrl',
                object: att.fileUrl
            });
        }
    }
};
