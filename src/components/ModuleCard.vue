<template>
  <component 
    :is="linkComponent"
    :to="to"
    :href="href"
    class="module-card"
    :class="{ 'is-hovered': isHovered, 'is-pressed': isPressed }"
    :style="cardStyles"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
  >
    <div class="module-content">
      <div class="module-tag" :style="tagStyle">
        {{ tag }}
      </div>
      <h2 class="module-name" v-html="formattedName"></h2>
      <p class="module-desc">{{ description }}</p>
      <div class="module-status">
        <span v-for="(status, index) in statuses" :key="index">
          {{ status }}
        </span>
      </div>
    </div>
    <div class="anime-decor" :style="decorStyle">{{ decor }}</div>
    <div class="btn-action" :style="buttonStyle">
      {{ buttonText }}
      <span>→</span>
    </div>
  </component>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  tag: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  statuses: {
    type: Array,
    required: true
  },
  decor: {
    type: String,
    required: true
  },
  buttonText: {
    type: String,
    required: true
  },
  accentColor: {
    type: String,
    default: null
  },
  rotation: {
    type: Object,
    default: () => ({ x: 0, y: 0 })
  },
  to: {
    type: [String, Object],
    default: null
  },
  href: {
    type: String,
    default: null
  }
})

const isHovered = ref(false)
const isPressed = ref(false)

const linkComponent = computed(() => {
  if (props.href) return 'a'
  if (props.to) return 'router-link'
  return 'article'
})

const formattedName = computed(() => {
  return props.name.replace('\n', '<br>')
})

const cardStyles = computed(() => {
  const styles = {}
  
  if (props.accentColor) {
    styles.borderColor = props.accentColor
    styles.boxShadow = `6px 6px 0px ${props.accentColor}`
  }
  
  if (!isHovered.value && !isPressed.value) {
    styles.transform = `perspective(1000px) rotateY(${props.rotation.x}deg) rotateX(${props.rotation.y}deg)`
  }
  
  return styles
})

const tagStyle = computed(() => {
  if (props.accentColor) {
    return { color: props.accentColor }
  }
  return {}
})

const decorStyle = computed(() => {
  if (props.accentColor) {
    return { color: props.accentColor }
  }
  return {}
})

const buttonStyle = computed(() => {
  if (props.accentColor) {
    return { borderColor: props.accentColor }
  }
  return {}
})

const handleMouseEnter = () => {
  isHovered.value = true
}

const handleMouseLeave = () => {
  isHovered.value = false
  isPressed.value = false
}

const handleMouseDown = () => {
  isPressed.value = true
}

const handleMouseUp = () => {
  isPressed.value = false
}
</script>

<style scoped>
.module-card {
  background: var(--glass);
  border: 2px solid #fff;
  padding: 2rem;
  backdrop-filter: blur(10px);
  position: relative;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
  box-shadow: var(--brutal-shadow);
  overflow: hidden;
  height: 450px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-decoration: none;
  color: inherit;
}

.module-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: 0.5s;
}

.module-card.is-hovered {
  transform: translateY(-20px) rotateX(10deg) rotateY(-5deg) !important;
  border-color: var(--neon-mint) !important;
  box-shadow: 15px 15px 0px var(--neon-mint) !important;
}

.module-card.is-hovered::before {
  opacity: 1;
}

.module-card.is-pressed {
  transition: 0.1s !important;
  box-shadow: 2px 2px 0px black !important;
}

.module-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--neon-mint);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.module-tag::before {
  content: '';
  width: 8px;
  height: 8px;
  background: var(--neon-mint);
  display: inline-block;
  box-shadow: 0 0 10px var(--neon-mint);
}

.module-name {
  font-family: 'Outfit', sans-serif;
  font-size: 2.2rem;
  text-transform: uppercase;
  line-height: 1;
  margin-bottom: 1rem;
}

.module-desc {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  font-weight: 300;
}

.module-status {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  margin-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.anime-decor {
  position: absolute;
  right: -20px;
  bottom: 20px;
  font-size: 8rem;
  opacity: 0.05;
  font-weight: 900;
  pointer-events: none;
  writing-mode: vertical-rl;
}

.btn-action {
  margin-top: auto;
  border: 1px solid #fff;
  background: transparent;
  color: #fff;
  padding: 10px;
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  font-size: 11px;
  transition: 0.3s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.module-card.is-hovered .btn-action {
  background: #fff;
  color: #000;
}

@media (max-width: 800px) {
  .module-card {
    width: 90%;
    max-width: 350px;
    height: 400px;
  }
}
</style>
