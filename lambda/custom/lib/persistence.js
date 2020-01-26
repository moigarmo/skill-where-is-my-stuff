const ddbAdapter = require('ask-sdk-dynamodb-persistence-adapter');
const ddbTableName = 'UserSavedStuf';

function getPersistenceAdapter() {
    return new ddbAdapter.DynamoDbPersistenceAdapter({
        tableName: ddbTableName,
        createTable: true,
    });
}

function StuffRepository(attributesManager) {
    this.attributesManager = attributesManager;

    return {
        findStuff(what) {
            return (attributesManager.getSessionAttributes().data || {})[what];
        },
        listStuff() {
            return Object.keys(attributesManager.getSessionAttributes().data || {});
        },
        async saveStuff(what, where) {
            const sessionAttributes = attributesManager.getSessionAttributes();

            if (!sessionAttributes.data) {
                sessionAttributes.data = {};
            }

            if (!sessionAttributes.history) {
                sessionAttributes.history = [];
            }

            sessionAttributes.history.push({
                "what": what,
                "where": sessionAttributes.data[what]
            })
            sessionAttributes.data[what] = where;

            attributesManager.setPersistentAttributes(sessionAttributes);
            await attributesManager.savePersistentAttributes();
        },
        async removeStuff(what) {
            const sessionAttributes = attributesManager.getSessionAttributes();

            if (sessionAttributes.data && sessionAttributes.data[what]) {
                sessionAttributes.history.push({
                    "what": what,
                    "where": sessionAttributes.data[what]
                });
                delete sessionAttributes.data[what];
                attributesManager.setPersistentAttributes(sessionAttributes);
                await attributesManager.savePersistentAttributes();
                return true;
            }

            return false;
        }, 
        async undo() {
            const sessionAttributes = attributesManager.getSessionAttributes();

            const lastKnownValue = (sessionAttributes.history || []).pop();

            if (lastKnownValue) {
                if (lastKnownValue.where) {
                    sessionAttributes.data[lastKnownValue.what] = lastKnownValue.where;
                } else {
                    delete sessionAttributes.data[lastKnownValue.what];
                }

                attributesManager.setPersistentAttributes(sessionAttributes);
                await attributesManager.savePersistentAttributes();
                return true;
            }

            return false;
        }
    };
}

module.exports = { getPersistenceAdapter, StuffRepository };