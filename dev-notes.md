Design/implementation notes on the plugin and GardenJS in genera
l

# Decorators
I am having trouble getting these to work. It's unclear how to mount
them in a DAS file. Passing file names didn't do the job for me. I
didn't get any errors -- the decorated component just doesn't show up in
the left nav.

For a basic example, see `src/HotkeyPrompt/HotkeyPromptWithDecorator.das.ts`.
I've tried the following decorator values:
- `'src/slot-decorator.ts'`
- `'slot-decorator.ts'`
- `'../slot-decorator.ts'`

I also tried including my decorator class directly, but got
`ReferenceError: document is not defined`. It seems the DAS is being
executed in a TSX environment without access to the DOM, rather than
Vite. This is a bit awkward.

Integration would be easier if upstream could:
- Add an example of using decorators to the GardenJS repo,
- Add an example DAS file `decorators` entry to the docs, and
- Emit an error message somewhere if the decorator could not be loaded

Also, it would be nice to be able to switch between decorators at the
Example level, to see the same component in different contexts (or
inject different slot content using the workaround below).

# Slots
The official workaround for slots is to write a wrapper component that
constructs the component under tests and then injects the slot content.
This works well, with the caveat that a different DAS is then needed for
each different slot value, and then they each show up in GardenJS as a
separate component rather than different examples of the same component.

Once decorators are working, I will try to inject the slot content using
a decorator instead of with a separate example component.

Eventually, I hope GardenJS adds first-class support for slot content
within examples. Ideally, we could designate slot content either with a
component file or with an HTML string. Also, we will have to consider
both default and named slots.

# Mapping inputs to properties
We need some way of knowing, in the DAS file, which inputs should map to
properties and which should map to attributes.

# Customized built-in elements
Rather than a full standalone vanilla Web component, it is also possible
to extend the behavior of the built-in element types like `<p>`. Then
you can use your custom version like:
```html
<p is="MySpecialParagraphComponent">Content</p>
```

I haven't yet thought about how to support this.

# Form-Associated Custom Elements
Haven't investigated whether these will need special support.

# Injecting static asset URLs from DAS files
I would very much like to do this, but it breaks I think due to the
Vitest versus TSX discrepancy discussed in [Decorators], above. As a
workaround, place assets in `/public` and hardcode the url.

# Testing
Vitest seems like a natural choice.
