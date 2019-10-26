```
                              ╭──╮╭───┬╮╭────╮
                          ╭──╮├──┤│    ││ ─  │╭────╮
  ╭────◉  connected       │  ││  ││   ─┤│    ││ ╭──╯╭──╮╭╮
  │                       │  ││  ││   ╭╯│ `○─┤│ ╰──╮│  │││╭────╮
╭─┴─╮ ╭──╮╭╮              │  │╰──╯╰───╯ ╰────╯│    ││  ╰╯││ ╭──╯╭──╮╭────╮
│   ╰╮│  │││╭────╮        ╰──╯                ╰────╯├─── ││ ╰──╮│  ││ ○  │
│    ││  ╰╯││  ╭╮│╭────╮       \||/ ╭────╮╭────╮    ╰────╯│    ││  ││    │
│  ╭╮│├──○ ││  ╰╯││ ─  │╭──┬─╮╭(oo)╮│  ╭╮││  ╭╮│          ╰────╯│  ││ ───┤
╰──╯╰╯╰────╯│   ╭╯│    ││    │├─── ││  ╰╯││  ╰╯│                ╰──╯╰──┬─╯
            ╰───╯ │ ───┤│   ╭╯│╭╮  ││   ╭╯│   ╭╯  disconnected  ◉──────╯
                  ╰────╯│   │ │╰╯  │╰───╯ ╰───╯
                        ╰───╯ ╰──┴─╯
```

> Small wrapper for Hyperapp to emulate `connected` and `disconnected` lifecycle events.

## Overview

Hyperapp is super tiny ui framework that is centered around app state with awesome features rich ecosystem.
With super lean code however, it is inevitable some features that we might be used to aren't available in the core library.

One such feature is the ability to grab the reference of a newly created or removed DOM node. I found myself wanting this feature since I started using Hyperapp few weeks ago and this package is one possible answer for this requirement.

## Usage

 Full app lifecycle events coverage including app root node

 ```js
 import * as hyperapp from 'https://unpkg.com/hyperapp?module'
 import { lifecycle } from 'https://unpkg.com/hyperapp-lifecycle?module'

  const onconnected = (state, evt) => console.log('Connected:', evt.target.tagName) || state
  const ondisconnected = (state, evt) => console.log('Disconnected:', evt.target.tagName) || state

  const {h, app} = lifecycle(hyperapp)

  app(init:{}, view =>
   h('section', {onconnected},                      // Connected: SECTION
     h('main', {onconnected},                       // Connected: MAIN
       h('div', {onconnected},                      // Connected: DIV
        h('span',{ondisconnected, id: 'removeme'})  // Disconnected: SPAN
       )
      )
    ),
  node: document.getElementById('app')
  )

  setTimeout(()=> {
    var node = document.getElementById('removeme')
    node.parentNode.removeChild(node)
    }, 1000)
 ```

## Support

Need help or have a question? post a questions at [StackOverflow](https://stackoverflow.com/questions/tagged/hyperapp-lifecycle+web+semantics)

*Please don't use the issue trackers for support/questions.*

## Contributions

Happy to accept external contributions to the project in the form of feedback, bug reports and even better - pull requests :)

## Credits

This package is based on the work of [Sergey Shpak](https://github.com/sergey-shpak) as can be viewed [here](https://gist.github.com/sergey-shpak/c1e0db3d52019eecb0b5717e8cbf00ad). The code performs black magic to hijack few of the node DOM methods in order to fire custom events.

In addition to adding few extra features, the original code was slightly modified and then optimized for efficient use of the `wrap` function so that it is used only for nodes with defined event handlers.

## Copyright and license

[MIT license](http://opensource.org/licenses/mit-license.php)
Copyright (c) Web Semantics, Inc.
