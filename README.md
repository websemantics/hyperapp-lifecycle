```
                              ╭──╮╭───┬╮╭────╮
                          ╭──╮├──┤│    ││ ─  │╭────╮
  ╭────◉  connected       │  ││  ││   ─┤│    ││ ╭──╯╭──╮╭╮
  │                       │  ││  ││   ╭╯│ ───┤│ ╰──╮│  │││╭────╮
╭─┴─╮ ╭──╮╭╮              │  │╰──╯╰───╯ ╰────╯│    ││  ╰╯││ ╭──╯╭──╮╭────╮
│   ╰╮│  │││╭────╮        ╰──╯                ╰────╯├─── ││ ╰──╮│  ││ ─  │
│    ││  ╰╯││  ╭╮│╭────╮       \||/ ╭────╮╭────╮    ╰────╯│    ││  ││    │
│  ╭╮│├─── ││  ╰╯││ ─  │╭──┬─╮╭(oo)╮│  ╭╮││  ╭╮│          ╰────╯│  ││ ───┤
╰──╯╰╯╰────╯│   ╭╯│    ││    │├─── ││  ╰╯││  ╰╯│                ╰──╯╰──┬─╯
            ╰───╯ │ ───┤│   ╭╯│╭╮  ││   ╭╯│   ╭╯  disconnected  ◉──────╯
                  ╰────╯│   │ │╰╯  │╰───╯ ╰───╯
                        ╰───╯ ╰──┴─╯
```

> Small wrapper for Hyperapp to emulate `connected` and `disconnected` lifecycle events

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
