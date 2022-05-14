<script setup lang="ts">
/* eslint-disable no-console */
import type { ValueOf } from 'type-fest'

// TODO: start 和 end 的区别，是当需要隐藏元素式，从哪边删除
// minVisibleItems 是当删除时，判断是否到了最小可见元素数量

const props = withDefaults(defineProps<OverflowListProps>(), {
  minVisibleItems: 0,
})

const OverflowDirection = {
  NONE: 0,
  GROW: 1,
  SHRINK: 2,
}

interface OverflowListProps {
  // 元素
  items?: string[]
  // 最小可见元素数量
  minVisibleItems?: number
}

interface UpState {
  direction?: ValueOf<typeof OverflowDirection>
  lastOverflowCount?: number
  overflow?: string[]
  visible?: string[]
}

const listRef = ref<HTMLDivElement>()
const spacerRef = ref<HTMLDivElement>()

const previousWidths: Map<Element, number> = new Map()

const upState = ref<UpState>({
  direction: OverflowDirection.GROW,
  lastOverflowCount: 0,
  overflow: [],
  visible: props.items,
})

// 行为判断 （增长，收缩，无变化）
function handlePartition(growing: number): void {
  const { direction, overflow = [], lastOverflowCount, visible = [] } = upState.value
  const { minVisibleItems, items } = toRefs(props)
  // 无变化
  if (growing === OverflowDirection.NONE) { upState.value.direction = OverflowDirection.NONE }

  // 增长
  else if (growing === OverflowDirection.GROW) {
    const updatedOverflowCount = direction === OverflowDirection.NONE ? overflow.length : lastOverflowCount
    upState.value = {
      direction: OverflowDirection.GROW,
      lastOverflowCount: updatedOverflowCount,
      overflow: [],
      visible: items?.value,
    }
  }
  // 减小（不可小于最少可见元素数量）
  else if (growing === OverflowDirection.SHRINK && visible.length > minVisibleItems.value) {
    const newVisible = [...visible]
    // 根据 collapse 位置，调整下一个要 监视的元素
    const next = newVisible.pop()
    if (next !== undefined) {
      upState.value = {
        // set SHRINK mode unless a GROW is already in progress.
        // GROW shows all items then shrinks until it settles, so we
        // preserve the fact that the original trigger was a GROW.
        // 设置收缩模式，除非已在进行增长。GROW显示所有项目然后收缩，直到它稳定下来，所以我们保留原始触发器是GROW的事实。
        direction: direction !== OverflowDirection.GROW ? OverflowDirection.SHRINK : direction,
        overflow: [next, ...overflow],
        visible: newVisible,
      }
    }
  }
}

function handleRepartition(growing: boolean) {
  if (spacerRef.value) {
    const state = growing
      ? OverflowDirection.GROW
      : spacerRef.value.getBoundingClientRect().width < 0.9 ? OverflowDirection.SHRINK : OverflowDirection.NONE
    handlePartition(state)

    nextTick(() => {
      // 更新后，再次判断是否有挤压
      if (upState.value.direction !== OverflowDirection.NONE)
        handleRepartition(false)
    })
  }
}

const onResize = (entries: ResizeObserverEntry[]) => {
  const growing = entries.some((entry) => {
    const previousWidth = previousWidths.get(entry.target) || 0
    return entry.contentRect.width > previousWidth
  })
  handleRepartition(growing)
  entries.forEach(entry => previousWidths.set(entry.target, entry.contentRect.width))
}

const init = () => {
  // 需要到 list 容器的 resize 做监控，当有变化时，需要重新初始化
  const io = new ResizeObserver(onResize)

  if (listRef.value)
    io.observe(listRef.value)

  handleRepartition(false)
}

// TODO: 首次渲染，元素全部被渲染出来后，执行-分配函数

/*
-> 判断标志是否受到挤压，如果受到挤压，执行-压缩函数
-> 更新 DOM
-> 绘制完毕，执行-分配函数
-> 判断是否受到挤压，如果受到挤压，执行-压缩函数
-> 更新 DOM
-> 绘制完毕，执行-分配函数
-> 判断是否受到挤压，未受到挤压，执行-和谐函数
-> 监听 resize
-> size 变化，判断之前容器的大小，如果是变大了，执行-增长函数，否则执行-分配函数
-> ...
-> 更新 DOM
-> 和谐函数，break
*/

onMounted(() => {
  init()
})
</script>

<template>
  <div ref="listRef" class="overflow-list-wrapper">
    <div v-for="item in upState.visible" ref="itemRefs" :key="item" class="list-item">
      <div :class="`i-carbon-${item}`" />
      <span>{{ item }}</span>
    </div>
    <div class="end">
      +{{ upState.overflow?.length }}
    </div>
    <div ref="spacerRef" class="spacer" />
  </div>
</template>

<style lang="less" scoped>
.overflow-list-wrapper {
  display: flex;
  flex-wrap: nowrap;
  min-width: 0;
}

.list-item {
  display: flex;
  align-items: center;
  font-size: 13px;

  background-color: #75cfff;
  padding: 0 3px;
  border-radius: 4px;

  span {
    margin-left: 2px;
  }
}

.list-item + .list-item {
  margin-left: 5px;
}

.end {
  margin-right: 8px;
  margin-left: 8px;
  flex: 0 0 auto;

  background-color: pink;
  padding: 0 3px;
  border-radius: 4px;
  width: 40px;
  text-align: center;
}

.spacer {
  flex-shrink: 1;
  width: 1px;
}
</style>
