import { effectList } from "./effect.mjs"
const isObject = val => val !== null && typeof val === 'object'

//缓存对象 避免重复代理
const objectMap = new WeakMap()
//缓存代理 避免重复
const proxyMap = new WeakMap()
// 收集依赖
const targetMap = new WeakMap()

function reactive(target) {
  let observed = objectMap.get(target)
  // 避免重复代理
  if (observed) {
    return observed
  }
  // 重复调用reactive
  if (proxyMap.has(target)) {
    return target
  }
  observed = new Proxy(target, handlers)
  objectMap.set(target, observed)
  proxyMap.set(observed, target)
  return observed
}

const handlers = {
  get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver)
    track(target, key)
    return isObject(res) ? reactive(res) : res
  },
  set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver)
    trigger(target, key)
    return result
  }
}

function track(target, key) {
  const effect = effectList[effectList.length - 1]
  if (effect) {
    let depsMap = targetMap.get(target)
    if (depsMap === void 0) {
      depsMap = new Map()
      targetMap.set(target, depsMap)
    }
    let dep = depsMap.get(key)
    if (dep === void 0) {
      dep = new Set()
      depsMap.set(key, dep)
    }
    if (!dep.has(effect)) {
      dep.add(effect)
      effect.deps.push(dep)
    }
  }
}

function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (depsMap === void 0) {
    return;
  }
  const effects = new Set()
  const computedRunners = new Set()
  if (key !== void 0) {
    let deps = depsMap.get(key)
    deps.forEach(effect => {
      if (effect.computed) {
        computedRunners.add(effect)
      } else {
        effects.add(effect)
      }
    })
  }
  const run = effect => {
    effect()
  }
  computedRunners.forEach(run)
  effects.forEach(run)
}

export { reactive }