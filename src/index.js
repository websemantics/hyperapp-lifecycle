/**
 * Small wrapper for Hyperapp to emulate `connected` and `disconnected`
 * lifecycle events by means of custom events.
 */

 /* User configurable event types */
export let CONNECTED = 'connected'
export let DISCONNECTED = 'disconnected'

/**
 * Wrapper around Hyperapp `app` and `h` functions.
 *
 * @param {Module} hyperapp - Imported Hyperapp module (see example above)
 * @returns {Object} {app, h}
 */

export function lifecycle(hyperapp) {
  /**
   * Lifecycle hyperscript shorthand to use instead of original `hyperapp.h`
   */
  function h() {
    return withChildLifeCycle(hyperapp.h.apply(null, arguments))
  }

  /**
   * Lifecycle app to use instead of original `hyperapp.app`
   *
   * @description This will ensure that the app root node can receive the two
   * lifecycle events, `connected` and `connected`
   */
  function app(props) {
    props.node.parentNode.appendChild = wrap('appendChild', CONNECTED)
    props.node.parentNode.insertBefore = wrap('insertBefore', CONNECTED)
    props.node.parentNode.removeChild = wrap('removeChild', DISCONNECTED)

    hyperapp.app.apply(null, arguments)

    /**
     * Fire a `connected` event manually when the original node is being recycled
     * by Hyperapp (will not incur `appendChild` or `insertBefore` calls)
     */
    if (props.view(props.init).name === props.node.nodeName.toLowerCase()) {
      defer(() => props.node.dispatchEvent(new CustomEvent(CONNECTED, { target: props.node })))
    }
  }

  return { app, h}
}

/* Shamelessly stolen from Hyperapp */
var defer = typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : setTimeout

/**
 * Helper methods originally written by [Sergey](https://github.com/sergey-shpak)
 * to wrap a node's `appendChild`, `removeChild` and `insertBefore` methods used by
 * Hyperapp to fire lifecycle custom events.
 *
 * ## Note
 *
 * The code has been slightly modified from the original and to optimize for efficient
 * use of the `wrap` function (only used for nodes with defined event handlers)
 *
 * @source https://gist.github.com/sergey-shpak/c1e0db3d52019eecb0b5717e8cbf00ad
 * @see https://github.com/jorgebucaran/hyperapp/issues/717
 */

function withChildLifeCycle(node) {

  /* Attach wrappers for nodes with defined event handlers only */
  const added = node.props[`on${CONNECTED}`] ? {
    appendChild: wrap('appendChild', CONNECTED),
    insertBefore: wrap('insertBefore', CONNECTED)
  } : {}

  const removed = node.props[`on${DISCONNECTED}`] ? {
    removeChild: wrap('removeChild', DISCONNECTED)
  } : {}

  return {
    ...node,
    props: {
      ...added,
      ...removed,
      ...node.props
    }
  }
}

function wrap(fn, eventType) {
  return function (target) {
    defer(() => target.dispatchEvent(new CustomEvent(eventType, { target })))
    return Object.getPrototypeOf(this)[fn].apply(this, arguments)
  }
}
