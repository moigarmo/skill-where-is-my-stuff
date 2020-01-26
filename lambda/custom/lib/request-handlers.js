const Alexa = require('ask-sdk');
const { StuffRepository } = require('./persistence')

const LaunchRequest = {
    canHandle(handlerInput) {
        return Alexa.isNewSession(handlerInput.requestEnvelope)
            || Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        const { attributesManager } = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const attributes = await attributesManager.getPersistentAttributes() || {};

        attributesManager.setSessionAttributes(attributes);

        const speechOutput = requestAttributes.t('LAUNCH_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(speechOutput)
            .getResponse();
    }
};


const ExitHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        return handlerInput.responseBuilder
            .speak(requestAttributes.t('EXIT_MESSAGE'))
            .getResponse();
    }
};

const SessionEndedRequest = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
        return handlerInput.responseBuilder.getResponse();
    }
};

const HelpIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        return handlerInput.responseBuilder
            .speak(requestAttributes.t('HELP_MESSAGE'))
            .reprompt(requestAttributes.t('EXIT_MESSAGE'))
            .getResponse();
    }
};

const FindStuffIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FindStuffIntent';
    },
    async handle(handlerInput) {
        const { attributesManager } = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();

        const what = Alexa.getSlotValue(handlerInput.requestEnvelope, 'what');

        if (!what) {
            throw new Error("Could not parse what slot");
        }

        const where = StuffRepository(attributesManager).findStuff(what);

        const speakOutput = where ? requestAttributes.t('STUFF_FOUND_MESSAGE', what, where)
            : requestAttributes.t('NOTHING_FOUND_MESSAGE', what)

        return handlerInput.responseBuilder
            .speak(speakOutput + requestAttributes.t('SOMETHING_ELSE_MESSAGE'))
            .reprompt(requestAttributes.t('EXIT_MESSAGE'))
            .getResponse();
    }
};

const SaveStuffIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SaveStuffIntent';
    },
    async handle(handlerInput) {
        const { attributesManager } = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();

        const what = Alexa.getSlotValue(handlerInput.requestEnvelope, 'what');
        const where = Alexa.getSlotValue(handlerInput.requestEnvelope, 'where');

        if (!what || !where) {
            throw new Error("Error parsing slots for save intent");
        }

        await StuffRepository(attributesManager).saveStuff(what, where);

        return handlerInput.responseBuilder
            .speak(requestAttributes.t('SAVED_DATA_MESSAGE', what, where) + requestAttributes.t('SOMETHING_ELSE_MESSAGE'))
            .reprompt(requestAttributes.t('EXIT_MESSAGE'))
            .getResponse();
    }
};

const UndoIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'UndoIntent';
    },
    async handle(handlerInput) {
        const { attributesManager } = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        
        const speachOutput = await StuffRepository(attributesManager).undo() ?
            'OPERATION_UNDONE_MESSAGE' : 'NO_UNDO_OPERATION_MESSAGE';

        return handlerInput.responseBuilder
            .speak(requestAttributes.t(speachOutput) + requestAttributes.t('SOMETHING_ELSE_MESSAGE'))
            .reprompt(requestAttributes.t('EXIT_MESSAGE'))
            .getResponse();
    }
};

const ListStuffIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ListStuffIntent';
    },
    async handle(handlerInput) {
        const { attributesManager } = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();

        const list = StuffRepository(attributesManager).listStuff();

        const speakOutput = list.length > 0 ? requestAttributes.t('ALL_STUFF_LIST_MESSAGE', list)
            : requestAttributes.t('NOTHING_SAVED_MESSAGE');
            
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(requestAttributes.t('EXIT_MESSAGE'))
            .getResponse();
    }
};

const RemoveStuffIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RemoveStuffIntent';
    },
    async handle(handlerInput) {
        const { attributesManager } = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();

        const what = Alexa.getSlotValue(handlerInput.requestEnvelope, 'what');

        if (!what) {
            throw new Error("Error parsing slots for save intent");
        }

        const speachOutput = await StuffRepository(attributesManager).removeStuff(what) ?
             'STUFF_REMOVED_MESSAGE': 'NOTHING_FOUND_MESSAGE';        

        return handlerInput.responseBuilder
            .speak(requestAttributes.t(speachOutput, what) + requestAttributes.t('SOMETHING_ELSE_MESSAGE'))
            .reprompt(requestAttributes.t('EXIT_MESSAGE'))
            .getResponse();
    }
};

module.exports = {
    LaunchRequest,
    ExitHandler,
    SessionEndedRequest,
    HelpIntent,
    SaveStuffIntent,
    FindStuffIntent,
    ListStuffIntent,
    RemoveStuffIntent,
    UndoIntent
};