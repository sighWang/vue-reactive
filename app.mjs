import { reactive } from "./reactive.mjs"
import { computed } from "./computed.mjs"
const node = reactive({
    leftChild: 1
  })
  console.log(node.leftChildren, node.rightChildren)
  const children = computed(() => node.leftChild + (parseInt(node.rightChildren) || 0))
  console.log(children.value)
  node.leftChild = 10
  console.log(children.value)
  node.rightChildren = 2
  console.log(children.value)