const Alexa = require('ask-sdk');
const { LocalizationInterceptor } = require('./request-interceptors');
const {
    LaunchRequest,
    ExitHandler,
    SessionEndedRequest,
    HelpIntent,
    SaveStuffIntent,
    FindStuffIntent,
    ListStuffIntent,
    RemoveStuffIntent,
    UndoIntent
} = require('./request-handlers');
const { ErrorHandler } = require('./response-handlers');
const { getPersistenceAdapter } = require('./persistence');

module.exports = Alexa.SkillBuilders.custom()
    .withPersistenceAdapter(getPersistenceAdapter())
    .addRequestHandlers(
        LaunchRequest,
        ExitHandler,
        SessionEndedRequest,
        HelpIntent,
        SaveStuffIntent,
        FindStuffIntent,
        ListStuffIntent,
        RemoveStuffIntent,
        UndoIntent
    )
    .addRequestInterceptors(LocalizationInterceptor)
    .addErrorHandlers(ErrorHandler)
    .lambda();
