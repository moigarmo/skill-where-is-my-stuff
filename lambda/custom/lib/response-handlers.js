const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);
        console.log(`Error stack: ${error.stack}`);
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        return handlerInput.responseBuilder
            .speak(requestAttributes.t('ERROR_MESSAGE') + requestAttributes.t('SOMETHING_ELSE_MESSAGE'))
            .reprompt(requestAttributes.t('EXIT_MESSAGE'))
            .getResponse();
    }
};

module.exports = { ErrorHandler };