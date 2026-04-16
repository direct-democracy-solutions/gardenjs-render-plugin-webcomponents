export default {
  name: 'HotkeyPromptLogin',

  // TODO get pass different content into the slot rather than use this wrapper component
  file: './HotkeyPrompt.loginexample.ts',

  description: 'Displays keybind icon and emits events when the key is pressed',
  decorators: [ './watch-hotkey-decorator.ts' ], // TODO not working
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
