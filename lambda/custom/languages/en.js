module.exports = {
  translation: {
      SAVED_DATA_MESSAGE: 'Ok, I saved that you left %s in %s.',
      STUFF_REMOVED_MESSAGE: 'Ok, I removed %s from your stuff.',
      LAUNCH_MESSAGE: 'Tell me where you left something or what cant you find.',
      STUFF_FOUND_MESSAGE: [
          'You have %s in %s.',
          'You left %s in %s.',
          'You told me that you put %s in %s.'
      ],
      ALL_STUFF_LIST_MESSAGE: 'This is the list of stuff I remember: %s.',
      NOTHING_SAVED_MESSAGE: 'You didnt tell me anything to remember yet.',
      NOTHING_FOUND_MESSAGE: 'I cant find anything called %s.',
      HELP_MESSAGE: `If you want to save something so I can remember it for you, say: I left the object in the place.
                     If you want to remember where you put something, say: I cant find the object.
                     To know the whole list of stuff I remember for you, say: Tell me the stuff you remember.
                     To remove an element, say: Remove the element.
                     If you need to undo the last operation, say: Undo the last operation.`,
      ERROR_MESSAGE: 'Sorry, I couldnt process your request.',
      EXIT_MESSAGE: ['Bye', 'Good Bye', 'See you'],
      SOMETHING_ELSE_MESSAGE: ['Any other request?', 'Anything else?', 'Do you need anything else?'],
      NO_UNDO_OPERATION_MESSAGE: 'There are no undoable operations.',
      OPERATION_UNDONE_MESSAGE: 'Done.'
  }
}