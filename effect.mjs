const effectList = []

function effect (fn, options = {}) {
    const effect = createReactiveEffect(fn, options)
    if (!options.lazy) {
      effect()
    }
    return effect
  }
  
  function createReactiveEffect(fn, options) {
    const effectFn = function (...args) {
        if (effectList.indexOf(effectFn) === -1) {
            try {
              effectList.push(effectFn)
              return fn(...args)
            }
            finally {
              effectList.pop()
            }
          }
    }
    effectFn.lazy = options.lazy
    effectFn.computed = options.computed
    effectFn.deps = []
    return effectFn
  }
 export {effectList, effect}
