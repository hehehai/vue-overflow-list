<script setup lang="ts">
import { listBothEnds } from '~/composables/list'

interface OverflowListProps {
  // 元素
  items?: string[]
  // 最小可见元素数量
  minVisibleItems?: number
  // 阈值
  threshold?: number
}

const props = withDefaults(defineProps<OverflowListProps>(), {
  threshold: 0.75,
})

const listRef = ref<HTMLDivElement>()
const itemRefs = ref<HTMLDivElement[]>()
const visibleStatus = ref<Map<HTMLDivElement, boolean>>(new Map())

const countPlace = computed(() => {
  return {
    start: listBothEnds(visibleStatus.value, 'start'),
    end: listBothEnds(visibleStatus.value, 'end'),
  }
})

const init = () => {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      visibleStatus.value.set(entry.target as HTMLDivElement, entry.isIntersecting)
    })
  }, {
    root: listRef.value,
    threshold: props.threshold ?? 0.75,
  })

  itemRefs.value?.forEach((item) => {
    visibleStatus.value.set(item, false)
    io.observe(item)
  })
}

onMounted(() => {
  init()
})
</script>

<template>
  <div class="overflow-list-wrapper">
    <div class="start">
      +{{ countPlace.start }}
    </div>
    <div ref="listRef" class="list">
      <div v-for="item in items" ref="itemRefs" :key="item" class="item">
        <div :class="`i-carbon-${item}`" />
        <span>{{ item }}</span>
      </div>
    </div>
    <div class="end">
      +{{ countPlace.end }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.overflow-list-wrapper {
  display: flex;
  flex-wrap: nowrap;
  min-width: 0;
}

.list {
  display: flex;
  flex: 1 1;
  flex-wrap: nowrap;
  overflow-x: scroll;

  .item {
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

  .item + .item {
    margin-left: 5px;
  }
}

.start, .end {
  margin-right: 8px;
  margin-left: 8px;
  flex: 0 0 auto;

  background-color: pink;
  padding: 0 3px;
  border-radius: 4px;
  width: 40px;
  text-align: center;
}
</style>
