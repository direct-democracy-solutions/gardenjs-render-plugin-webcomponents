export default {
  name: 'HotkeyPromptLogin',

  // TODO pass different content into the slot rather than use this wrapper component
  file: './HotkeyPrompt.loginexample.ts',

  description: 'Displays keybind icon and emits events when the key is pressed',
  decorators: [ '../EventLogDecorator.ts' ],
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
