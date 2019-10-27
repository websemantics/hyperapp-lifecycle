/**
 * Small wrapper for Hyperapp to emulate `connected` and `disconnected`
 * lifecycle events by means of custom events.
 *
 * @author Adnan M.Sagar <adnan@websemantics.ca>
 */

/* User configurable event types */
export let CONNECTED = 'connected'
export let DISCONNECTED = 'disconnected'

/**
 * Wrapper around Hyperapp `app` and `h` functions.
 *
 * @param {Module} hyperapp - Imported Hyperapp module (see example above)
 * @param {Boolean} lite - If true, `h` remains unchanged and `l` is used as needed
 * @returns {Object} {app, h, l}
 */

export function lifecycle(hyperapp, lite = false) {
  /**
   * Lifecycle hyperscript shorthand to use instead of original `hyperapp.h`
   */
  function l() {
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
      defer(() => props.node.dispatchEvent(new CustomEvent(CONNECTED, { detail: props.node })))
    }
  }

  /* Use original hyperapp.h in lite mode */
  const h = lite ? hyperapp.h : l

  return { app, h, l }
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
 * The code has been slightly modified from the original to ensure connected event
 * is fired on `appendChild` and `insertBefore` calls.
 *
 * @source https://gist.github.com/sergey-shpak/c1e0db3d52019eecb0b5717e8cbf00ad
 * @see https://github.com/jorgebucaran/hyperapp/issues/717
 */

function withChildLifeCycle(node) {
  return {
    ...node,
    props: {
      appendChild: wrap('appendChild', CONNECTED),
      insertBefore: wrap('insertBefore', CONNECTED),
      removeChild: wrap('removeChild', DISCONNECTED),
      ...node.props
    }
  }
}

function wrap(method, typeArg) {
  /**
   * @param {customEventInit} detail - Target node
   */
  return function (detail) {
    defer(() => detail.dispatchEvent(new CustomEvent(typeArg, { detail })))
    return Object.getPrototypeOf(this)[method].apply(this, arguments)
  }
}

