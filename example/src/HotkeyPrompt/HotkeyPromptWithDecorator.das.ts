// TODO move this back into the HotkeyPrompt directory, once we can
//  load decorators from other directories

export default {
  name: 'HotkeyPromptLoginWithDecorator',
  file: './HotkeyPrompt.ts',
  description: 'Displays keybind icon and emits events when the key is pressed',
  decorators: ['../SlotDecorator.ts'],

  // TODO: DOM objects are not available in this context for some
  //  reason. But I'd like to do:
  // import SlotDecorator from '../slot-decorator';
  // decorators: [ SlotDecorator ],

  examples: [
    {
      title: 'Log In prompt',
      input: {
        'img-src': '/enter-key.png',
        code: 'Enter',
      },
    },
  ],
};
