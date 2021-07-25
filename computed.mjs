
import {effect} from './effect.mjs'

function computed(fn) {
    const getter = fn
    const runner = effect(getter, { computed: true, lazy: true })
    return {
      get value() {
        return runner()
      }
    }
  }

  export { computed }