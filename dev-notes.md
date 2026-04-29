Design/implementation notes on the plugin and GardenJS in genera
l

# Decorators and Events
We may have multiple decorators listening to the same event from the
component under test. However, In that case, we have some options
Do events bubble through the decorator even if handled? If so, we can
just rely on native Web behavior (unless a decorator uses
event.preventDefault, in which case the user gets to live with the
consequences). In case they don't bubble through, we have two options:
    - impose the requirement on each decorator to manually re-raise
      events; or,
    - do tricky shit in the renderer to sandbox them.

Option 1 results in Uncaught DOMException: An attempt was made to use an
object that is not, or is no longer, usable.

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

# Importing and passing classes rather than file names
It would be nice to import classes in DAS files and use them directly,
rather than having to go through TSX. I tried it, but got
`ReferenceError: document is not defined`. It seems the DAS is
executed in a TSX environment without access to the DOM. This is a bit
awkward.

# Injecting static asset URLs from DAS files
I would very much like to do this, but it breaks I think due to the
Vitest versus TSX discrepancy discussed above. As a workaround, place
assets in `/public` and hardcode the url.

# Testing
Vitest seems like a natural choice.

# GardenJS adoption checklist

Items blocking DDS adoption of Garden:

- [x] Get decorators working in the example plugin
- [ ] Properties as inputs
- [ ] Decorators at example level
- [ ] Allow multiple decorators in DAS file
- [ ] Slots in DAS file
- [ ] Events

Till then, we are going without a component explorer.
