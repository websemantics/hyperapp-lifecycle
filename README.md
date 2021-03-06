```
                                 ╭──╮ ╭───┬╮ ╭────╮
                            ╭──╮ ├──┤ │    │ │ ─  │ ╭────╮
  ╭────◉  connected         │  │ │  │ │   ─┤ │    │ │ ╭──╯ ╭──╮╭╮
  │                         │  │ │  │ │   ╭╯ │ `○─┤ │ ╰──╮ │  │││ ╭────╮
╭─┴─╮  ╭──╮╭╮               │  │ ╰──╯ ╰───╯  ╰────╯ │    │ │  ╰╯│ │ ╭──╯ ╭──╮ ╭────╮
│   ╰╮ │  │││ ╭────╮        ╰──╯                    ╰────╯ ├─── │ │ ╰──╮ │  │ │ ○  │
│    │ │  ╰╯│ │  ╭╮│ ╭────╮         \||/  ╭────╮ ╭────╮    ╰────╯ │    │ │  │ │    │
│  ╭╮│ ├──○ │ │  ╰╯│ │ ─  │ ╭──┬─╮ ╭(oo)╮ │  ╭╮│ │  ╭╮│           ╰────╯ │  │ │ ───┤
╰──╯╰╯ ╰────╯ │   ╭╯ │    │ │    │ ├─── │ │  ╰╯│ │  ╰╯│                  ╰──╯ ╰──┬─╯
              ╰───╯  │ ───┤ │   ╭╯ │╭╮  │ │   ╭╯ │   ╭╯    disconnected  ◉───────╯
                     ╰────╯ │   │  │╰╯  │ ╰───╯  ╰───╯
                            ╰───╯  ╰──┴─╯
```

> Small wrapper for Hyperapp and Superfine to emulate `connected` and `disconnected` lifecycle events.

[![Hyperapp demo](https://img.shields.io/badge/Hyperapp%20demo-%E2%86%92-9D6EB3.svg?style=flat-square)](https://websemantics.github.io/hyperapp-lifecycle/demo/hyperapp.html)

[![Superfine demo](https://img.shields.io/badge/Superfine%20demo-%E2%86%92-9D6EB3.svg?style=flat-square)](https://websemantics.github.io/hyperapp-lifecycle/demo/superfine.html)

## Overview

[Hyperapp](https://github.com/jorgebucaran/hyperapp) is super tiny ui framework that is centered around app state with awesome flexibility and rich ecosystem. With super lean code however, it is inevitable that some features that we might be used to aren't available in the core library.

One such feature is the ability to grab the reference of a newly created or being removed DOM node. I found myself wanting this feature since I started using Hyperapp few weeks ago and this package is one possible answer for this requirement.

## What do you get

Ability to listen to two lifecycle events, `connected` and `disconnected` similar to `connectedCallback` and `disconnectedCallback` methods in [custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements).

## Usage

Full app lifecycle events coverage including app root node.

```js
import * as hyperapp from 'https://unpkg.com/hyperapp?module'
import { timeout } from 'https://unpkg.com/@hyperapp/time?module'
import { lifecycle } from 'https://unpkg.com/hyperapp-lifecycle?module'

const { app, h } = lifecycle(hyperapp)

const Log = type => (state, evt) => console.log(`${type}:`, evt.target.tagName) || state
const RemoveWorld = state => ({ ...state, world: false })

const init = { world: true }

const view = state =>
  h('section', { onconnected: Log('Connected') },                    // Connected: SECTION
    h('main', { onconnected: Log('Connected') },                     // Connected: MAIN
      h('div', { onconnected: Log('Connected') },                    // Connected: DIV
        h('span', { style: { color: 'green' } }, 'Hello'),
        state.world &&                                               // Disconnected: SPAN
        h('span', { ondisconnected: Log('Disconnected'), style: { color: 'blue' } }, ' World')
      )
    ),
    h('p', null, h('i', null, 'open browser console to see events print out'))
  )

const subscriptions = state => [timeout(RemoveWorld, { delay: 1000 })]

app({ init, view, node, subscriptions })
```

Notice that, the custom event `target` is the DOM node that defined the event handler.

## Lite mode

Lite mode features a supplementary function `l` that can be used as needed and where `h` remains unchanged. This gives more control on which nodes are allowed to fire lifecycle events for their children. The root node lifecycle events will be triggered as in full coverage mode.

The main point here to be aware of -as shown by the example below- is that, the use of `l` will ensure lifecycle events for children nodes and not for the node itself.

```js
import * as hyperapp from 'https://unpkg.com/hyperapp?module'
import { timeout } from 'https://unpkg.com/@hyperapp/time?module'
import { lifecycle } from 'https://unpkg.com/hyperapp-lifecycle?module'

const { app, h, l } = lifecycle(hyperapp, /* lite mode */ true)

const Log = type => (state, evt) => console.log(`${type}:`, evt.target.tagName) || state
const RemoveWorld = state => ({ ...state, world: false })

const init = { world: true }

const view = state =>
  h('section', { onconnected: Log('Connected') },                    // Connected: SECTION
    h('main', { onconnected: Log('Connected') },
      l('div', { onconnected: Log('Connected') },
        h('span', { style: { color: 'green' } }, 'Hello'),
        state.world &&                                               // Disconnected: SPAN
        h('span', { ondisconnected: Log('Disconnected'), style: { color: 'blue' } }, ' World')
      )
    ),
    h('p', null, h('i', null, 'open browser console to see events print out'))
  )

const subscriptions = state => [timeout(RemoveWorld, { delay: 1000 })]

app({ init, view, node, subscriptions })
 ```

## Superfine

The same works for the [Superfine](https://github.com/jorgebucaran/superfine) library, yay!

```js
import * as superfine from 'https://unpkg.com/superfine?module'
import { timeout } from 'https://unpkg.com/@hyperapp/time?module'
import { lifecycle } from 'https://unpkg.com/hyperapp-lifecycle?module'

const { patch, h } = lifecycle(superfine)

const Log = type => evt => console.log(`${type}:`, evt.target.tagName)
const RemoveWorld = state => ({ ...state, world: false })

const init = { world: true }

const view = state =>
  h('section', { onconnected: Log('Connected') },                    // Connected: SECTION
    h('main', { onconnected: Log('Connected') },                     // Connected: MAIN
      h('div', { onconnected: Log('Connected') },                    // Connected: DIV
        h('span', { style: 'color:green;' }, 'Hello'),
        state.world &&                                               // Disconnected: SPAN
        h('span', { ondisconnected: Log('Disconnected'), style: 'color:blue;' }, ' World')
      )
    ),
    h('p', null, h('i', null, 'open browser console to see events print out'))
  )

const app = state => patch(node, view(state))

app(init)

setTimeout(()=> app(RemoveWorld(init)), 1000)
```

## Credits

This package is based on the work of [Sergey Shpak](https://github.com/sergey-shpak) as can be viewed [here](https://gist.github.com/sergey-shpak/c1e0db3d52019eecb0b5717e8cbf00ad). The code performs black magic to hijack few of the node DOM methods in order to fire custom events. In addition to adding few extra features, the original code was slightly modified to ensure connected events are fired on `appendChild` and `insertBefore` calls.

## Support

Need help or have a question? post a questions at [StackOverflow](https://stackoverflow.com/questions/tagged/hyperapp-lifecycle+web+semantics)

*Please don't use the issue trackers for support/questions.*

## Contributions

Happy to accept external contributions to the project in the form of feedback, bug reports and even better - pull requests

## Copyright and license

[MIT license](http://opensource.org/licenses/mit-license.php)
Copyright (c) Web Semantics, Inc.
