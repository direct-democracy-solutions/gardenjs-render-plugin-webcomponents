// TODO move this back into the HotkeyPrompt directory, once we can
//  load decorators from other directories

export default {
  name: 'HotkeyPromptLoginWithDecorator',
  file: './HotkeyPrompt/HotkeyPrompt.ts',
  description: 'Displays keybind icon and emits events when the key is pressed',
  decorator: './SlotDecorator.ts', // TODO any way to get multiple decorators?

  // TODO: DOM objects are not available in this context for some
  //  reason. But I'd like to do:
  // import SlotDecorator from '../slot-decorator';
  // decorators: [ SlotDecorator ],

  examples: [
    {
      title: 'Log In prompt',
      // TODO inputs not being passed when the decorator exists
      input: {
        'img-src': '/enter-key.png',
        code: 'Enter',
      },
    },
  ],
};
