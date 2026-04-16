import * as WebComponentRendererBuilder from './src/garden-web-component-renderer.ts';

export default {
  // Define the server port:
  serverport: 3010,

  // Stop auto opening Gardenjs on start:
  // no_open_browser: true,

  // For garden development purposes only !!!
  // If this option is set to true, the "Code" tab is not displayed in the panel. An empty stage is displayed instead of the custom welcome_page.
  // devmodus: true,

  // This title is displayed above the navigation:
  // If the path to a logo is specified, "project_title" is used as the alt tag. Additional darkmode logo can be added.
  project_title: 'gardenjs-render-plugin-webcomponents',
  // project_logo: './src/assets/logo.svg',
  // project_logo_darkmode: './src/assets/logo_neg.svg',

  // Enter a path to your user-defined start page.
  // The HTML file may only contain the body part (without doctype, html-, head- & body tag).
  // Specify the CSS styles in a style tag under the HTML part.
  // welcome_page: './src/custom_welcome_page.html',

  // Show/hide the link to the docs in the sidebar:
  docs_link: true,

  // vite config file:
  vite_config: './garden.vite.config.ts',
  
  // Each entry is output with its subpages in the page tree:
  structure: {
    components: './src',
  },

  watch: {
    directories: ['./src/'],
    include: ['.scss', '.css', '.less', '.js', '.ts'],
  },

  renderer: {
    ts: WebComponentRendererBuilder,
  },

  // Option to generate component names in the component tree from dasFileName using your own function. e.g.:
  //  getComponentName: (dasFileName) => {
  //    return dasFileName.substring(0, dasFileName.indexOf('.das')
  //  }
  //
  // Option to generate component file names from dasFileName using your own function. Must return an array. First match will be used. e.g.:
  //  getComponentFileNames: (dasFileName) => {
  //    const nameWithoutExtension = dasFileName.substring(0, dasFileName.indexOf('.das')
  //    return [
  //      nameWithoutExtension + '.svelte',
  //      nameWithoutExtension + '.vue',
  //      nameWithoutExtension + '.tsx',
  //      nameWithoutExtension,
  //    ]
  //  }

  // Add global style files needed for your project:
  // additional_style_files: [
  //   'src/assets/scss/main.scss'
  // ],

  // Define the devices you want to simulate in the stage for each category.
  // There are three categories: small, medium, large.
  // If devices is not set , default devices for each category are used.
  // If a category is not set, no devices of this category are used.
  //  devices: {
  //    small: [
  //      {name: 'phone', w: 375, h: 667},
  //      {name: 'phone-small', w: 320, h: 568},
  //      {name: 'phone-plus', w: 414, h: 896}
  //    ],
  //    medium: [{name: 'tablet', w: 768, h: 1024}],
  //    large: [{name: 'laptop', w: 1440, h: 900}],
  //  },
  
  // Define custom background grid.
  //  grid: {
  //    style: 'dotted', // or 'lined'
  //    size: 16, // in px
  //    color: '#ddd', // any css color
  //  }

  // Edit or disable "Themes" depending on whether your app uses themes.
  // According to your requirements, you may also need to adjust the
  // "onThemeChange" function below accordingly.
  // themes: [
  //   {name: 'default', stageBg: 'white'},
  //   {name: 'dark', stageBg: '#101010'}, // manually set default active theme on start {active: true, name: 'dark', stageBg: '#101010'},
  //   {name: 'light', stageBg: '#eee'}
  // ],
  // themeHandler: onThemeChange
}

////  Edit or disable the function "onThemeChange" according to your project (see also "themes" above):
//function onThemeChange(theme) {
//  if (theme === 'default') {
//   delete document.body.dataset.theme
//  } else {
//   document.body.dataset.theme = theme
//  }
//}
  
