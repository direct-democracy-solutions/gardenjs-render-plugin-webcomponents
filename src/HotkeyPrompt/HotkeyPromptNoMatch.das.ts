export default {
  name: 'HotkeyPromptNoMatch',
  file: './HotkeyPrompt.nomatchexample.ts',
  description: 'Displays keybind icon and emits events when the key is pressed',
  examples: [
    {
      title: 'No Match prompt',
      input: {
        'img-src': '/space-key.png',
        code: 'Space',
      },
    },
  ],
};
