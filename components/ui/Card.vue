<template>
  <div
    :class="[
      'rounded-3xl transition-all duration-300',
      variantClasses[variant],
      hoverable && 'hover:shadow-lg cursor-pointer active:scale-95',
      className
    ]"
    @click="handleClick"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'elevated' | 'glass' | 'colored' | 'dark'
  hoverable?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  hoverable: false,
  className: ''
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const variantClasses = {
  default: 'bg-white shadow-sm border border-gray-100',
  elevated: 'bg-white shadow-lg',
  glass: 'bg-white/10 backdrop-blur-md border border-white/20',
  colored: 'bg-primary text-white shadow-lg shadow-purple-500/20',
  dark: 'bg-gray-800 border border-gray-700'
}

const handleClick = (event: MouseEvent) => {
  if (props.hoverable) {
    emit('click', event)
  }
}
</script>

