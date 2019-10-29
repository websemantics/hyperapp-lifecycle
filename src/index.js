/**
 * Small wrapper for Hyperapp and Superfine to emulate `connected`
 * and `disconnected` lifecycle events by means of custom events.
 *
 * @author Adnan M.Sagar <adnan@websemantics.ca>
 */

/* User configurable event types */
export let CONNECTED = 'connected'
export let DISCONNECTED = 'disconnected'

/**
 * Wrapper around Hyperapp `app` or Superfine `patch` and `h` functions.
 *
 * @param {Module} module - Imported Hyperapp or Superfine module
 * @param {Boolean} lite - If true, `h` remains unchanged and `l` is used as needed
 * @returns {Object} {app, h, l} or {patch, h, l}
 */

export function lifecycle(module, lite = false) {
  const exports = {
    /**
     * Lifecycle hyperscript shorthand to use instead of the original `module.h`
     */
    l: function l() {
      return withChildLifeCycle(module.h.apply(null, arguments))
    }
  }

  /* Use original module.h in lite mode */
  exports.h = lite ? module.h : exports.l

  /**
   * Enable lifecycle for app/patch to use instead of original `hyperapp.app` or `superfine.app`
   *
   * @description This will ensure that the app/patch root node can receive the two
   * lifecycle events, `connected` and `disconnected`
   */
  function root(node, vdom, callback) {
    node.parentNode.appendChild = wrap('appendChild', CONNECTED)
    node.parentNode.insertBefore = wrap('insertBefore', CONNECTED)
    node.parentNode.removeChild = wrap('removeChild', DISCONNECTED)

    callback.call()

    /**
     * Fire a `connected` event manually when the original node is being recycled
     * by module (will not incur `appendChild` or `insertBefore` calls)
     */
    if (vdom.name === node.nodeName.toLowerCase()) {
      defer(() => node.dispatchEvent(new CustomEvent(CONNECTED)))
    }
  }

  /* Export app if module is hyperapp */
  if (module.app) exports.app = props => root(props.node, props.view(props.init), () => module.app.call(null, props))

  /* Export patch if module is hyperapp */
  if (module.patch) exports.patch = (node, vdom) => root(node, vdom, () => module.patch.call(null, node, vdom))

  return exports
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
   * @param {customEventInit} target - Target node
   */
  return function (target) {
    defer(() => target.dispatchEvent(new CustomEvent(typeArg)))
    return Object.getPrototypeOf(this)[method].apply(this, arguments)
  }
}

