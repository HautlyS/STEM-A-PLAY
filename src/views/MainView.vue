<template>
  <div class="main-view">
    <!-- SVG Filters -->
    <svg class="svg-filters">
      <filter id="liquid-distort">
        <feTurbulence 
          type="fractalNoise" 
          baseFrequency="0.02" 
          numOctaves="3" 
          result="noise" 
          seed="2" 
        />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" />
      </filter>

      <symbol id="lotus" viewBox="0 0 100 100">
        <path 
          d="M50 10 C60 40 90 50 50 90 C10 50 40 40 50 10" 
          fill="none" 
          stroke="currentColor"
          stroke-width="0.5" 
        />
        <path 
          d="M50 20 C70 45 85 55 50 85 C15 55 30 45 50 20" 
          fill="none" 
          stroke="currentColor"
          stroke-width="0.5" 
        />
        <circle cx="50" cy="50" r="2" fill="currentColor" />
      </symbol>
    </svg>

    <!-- Background Grid -->
    <div 
      class="grid-canvas"
      :style="gridStyle"
    ></div>

    <!-- Scanline Effect -->
    <div class="scanline"></div>

    <!-- Nature Accent (Lotus) -->
    <div class="nature-accent">
      <svg width="100%" height="100%" style="color: var(--neon-mint); opacity: 0.5;">
        <use href="#lotus" x="0" y="0" width="100%" height="100%" />
      </svg>
    </div>

    <!-- HUD Frame -->
    <div class="hud-frame">
      <!-- Header -->
      <header class="hud-header">
        <div>
          <div class="school-tag">BHUMISPARSHA SCHOOL // 2027_VER</div>
          <h1 class="main-title">DHARMA<br>PLAY</h1>
        </div>
        <div class="header-right">
          <p>Om Gate Gate Parasamgate Bodhi Svaha</p>
          <p>STATUS: SYNCING WITH SANGHA_NET</p>
          <p class="glitch-text connection-text">CONNECTION: KHYENTSE FOUNDATION</p>
        </div>
      </header>

      <!-- Footer -->
      <footer class="hud-footer">
        <div class="terminal-tray">
          <span v-for="(line, index) in terminalLines" :key="index">
            > {{ line }}
          </span>
        </div>

        <div class="right-tray-group">
          <span class="system-alert">SYSTEM ALERT: EGO_DISSOLUTION_IN_PROGRESS</span>
          <div class="school-tag research-tag">
            RESEARCH_CORE: CYBER_BUDDHISM
          </div>
        </div>
      </footer>
    </div>

    <!-- Main Content - Module Cards -->
    <main class="modules-hub">
      <ModuleCard
        v-for="(module, index) in modules"
        :key="index"
        v-bind="module"
        :rotation="cardRotation"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ModuleCard from '../components/ModuleCard.vue'

// Terminal lines
const terminalLines = [
  'INITIALIZING SUDHANA_NO_SEKAI',
  'SEEDING HOUSAKY_AGI WITH COMPASSION... OK',
  'RENDERING TECHNO_SUTRA_AR_VR... 99.9%'
]

// Module data
const modules = [
  {
    tag: 'SUBMODULE // 01',
    name: "STEM 'A'\nPLAY",
    description: "Cyberpunk-buddhist Visual Novel (VN) based on the Avatamsaka Sutra (STEM ARRAY).",
    statuses: [
      'AGI CONNECTION: DECISION BRANCHING',
      'ENGINE: REN\'PY + RUST (Bevy VR + AR)',
      'PLATFORM: WINDOWS / MAC_OS / LINUX / iOS / ANDROID'
    ],
    decor: '物語',
    buttonText: 'PLAY HISTORY',
    accentColor: null,
    to: '/stemaplay'
  },
  {
    tag: 'SUBMODULE // 02',
    name: 'CYBER\nMANJU',
    description: 'Decentralized AI researching AGI for the benefit of all sentient beings. Artistic consciousness integrated into the dharmic.',
    statuses: [
      'BOOK | VIDEOCLIPE | SHOW = OK',
      'AUDIOVISUAL WORKSHOPS - BAND FOMENT',
      '',
      'OBJECTIVE: TOTAL_LIBERATION OF Saṃsāra'
    ],
    decor: '知恵',
    buttonText: 'SAY HELLO',
    accentColor: '#ff00ff',
    href: 'https://bhumisparshaschool.org'
  },
  {
    tag: 'SUBMODULE // 03',
    name: 'TECHNO\nSUTRA',
    description: 'AR and VR interface for 3D environments. Translation of the STEM Array into Portuguese. The word of the Buddha, virtually augmented.',
    statuses: [
      'LOCALE: INTERNATIONAL LAYERr',
      'AR_DEVICE: ACTIVE',
      'VR_DEVICE: FUND.RAISING'
    ],
    decor: '経典',
    buttonText: 'DEPLOY AUGMENTATION REALITY',
    accentColor: '#00d4ff',
    href: 'https://technosutra.bhumisparshaschool.org'
  }
]

// Mouse parallax state
const mouseX = ref(0)
const mouseY = ref(0)
const currentX = ref(0)
const currentY = ref(0)
const hue = ref(0)

// Grid animation
const gridStyle = computed(() => {
  return {
    filter: `url(#liquid-distort) hue-rotate(${hue.value}deg)`
  }
})

// Card rotation based on mouse position
const cardRotation = computed(() => {
  return {
    x: currentX.value,
    y: currentY.value
  }
})

// Animation frame IDs
let parallaxRafId = null
let pulseRafId = null
let lastPulseTime = 0

// Mouse move handler
const handleMouseMove = (e) => {
  mouseX.value = (window.innerWidth / 2 - e.pageX) / 50
  mouseY.value = (window.innerHeight / 2 - e.pageY) / 50
}

// Parallax animation loop
const updateParallax = () => {
  currentX.value += (mouseX.value - currentX.value) * 0.1
  currentY.value += (mouseY.value - currentY.value) * 0.1
  parallaxRafId = requestAnimationFrame(updateParallax)
}

// Pulse animation loop (limited to ~20fps for performance)
const pulse = (timestamp) => {
  if (timestamp - lastPulseTime >= 50) {
    hue.value = (hue.value + 1) % 360
    lastPulseTime = timestamp
  }
  pulseRafId = requestAnimationFrame(pulse)
}

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  parallaxRafId = requestAnimationFrame(updateParallax)
  pulseRafId = requestAnimationFrame(pulse)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  if (parallaxRafId) cancelAnimationFrame(parallaxRafId)
  if (pulseRafId) cancelAnimationFrame(pulseRafId)
})
</script>

<style scoped>
.main-view {
  background-color: var(--ink);
  color: #fff;
  font-family: 'Space Grotesk', sans-serif;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image:
    radial-gradient(circle at 50% 50%, rgba(20, 20, 30, 1) 0%, rgba(5, 5, 5, 1) 100%),
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  background-blend-mode: overlay;
  position: relative;
}

.svg-filters {
  position: absolute;
  width: 0;
  height: 0;
}

.grid-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  z-index: 0;
  filter: url(#liquid-distort);
  opacity: 0.4;
}

.scanline {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.1) 50%);
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 100;
}

.nature-accent {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  pointer-events: none;
  z-index: 1;
  opacity: 0.2;
  filter: blur(2px);
  animation: rotate 60s linear infinite;
}

@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.hud-frame {
  position: absolute;
  inset: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  pointer-events: none;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hud-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent);
  pointer-events: auto;
}

.school-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--neon-mint);
  background: rgba(0, 0, 0, 0.8);
  padding: 5px 10px;
  border: 1px solid var(--neon-mint);
  width: fit-content;
}

.research-tag {
  border-color: var(--hologram-pink);
  color: var(--hologram-pink);
}

.main-title {
  font-family: 'Outfit', sans-serif;
  font-size: 4rem;
  line-height: 0.8;
  background: var(--iridescent);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: flow 8s linear infinite;
  filter: drop-shadow(0 0 10px rgba(255, 0, 255, 0.3));
  margin-top: 10px;
}

@keyframes flow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.header-right {
  text-align: right;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  line-height: 1.6;
}

.connection-text {
  color: var(--hologram-pink);
}

.glitch-text {
  animation: glitch 1s infinite;
}

@keyframes glitch {
  0% {
    text-shadow: 2px 0 var(--hologram-pink), -2px 0 var(--cyber-blue);
  }
  25% {
    text-shadow: -2px 0 var(--hologram-pink), 2px 0 var(--cyber-blue);
  }
  100% {
    text-shadow: 2px 0 var(--hologram-pink), -2px 0 var(--cyber-blue);
  }
}

.hud-footer {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  pointer-events: auto;
}

.terminal-tray {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--neon-mint);
  text-transform: uppercase;
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-shadow: 0 0 5px rgba(0, 255, 170, 0.5);
}

.right-tray-group {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  text-align: right;
}

.system-alert {
  color: white;
  background: #ff0000;
  width: fit-content;
  padding: 2px 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: bold;
  box-shadow: 0 0 10px #ff0000;
  animation: blink-alert 0.5s infinite alternate;
}

@keyframes blink-alert {
  from {
    opacity: 1;
  }
  to {
    opacity: 0.7;
  }
}

.modules-hub {
  position: relative;
  z-index: 5;
  display: grid;
  grid-template-columns: repeat(3, 320px);
  gap: 40px;
  perspective: 1000px;
}

@media (max-width: 1200px) {
  .modules-hub {
    grid-template-columns: repeat(2, 320px);
  }
}

@media (max-width: 800px) {
  .main-view {
    overflow-y: auto;
    display: block;
    height: auto;
    min-height: 100vh;
  }

  .hud-frame {
    position: fixed;
    inset: 10px;
    pointer-events: none;
  }

  .hud-header,
  .hud-footer {
    pointer-events: auto;
  }

  .modules-hub {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 140px;
    padding-bottom: 120px;
    width: 100%;
  }

  .hud-footer {
    flex-direction: column-reverse;
    align-items: flex-start;
    gap: 20px;
  }

  .right-tray-group {
    align-self: flex-end;
    text-align: right;
  }

  .main-title {
    font-size: 3rem;
  }
}
</style>
