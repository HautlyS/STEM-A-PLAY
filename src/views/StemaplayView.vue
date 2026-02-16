<template>
  <div class="stemaplay-view">
    <!-- Loading Screen -->
    <div v-if="isLoading" class="loading-screen">
      <div class="loading-text">
        <span class="loading-line">INITIALIZING STEM ARRAY...</span>
        <span class="loading-line">LOADING SUTRA_SEQUENCES</span>
        <div class="loading-bar">
          <div class="loading-progress" :style="{ width: loadingProgress + '%' }"></div>
        </div>
        <span class="loading-percent">{{ Math.floor(loadingProgress) }}%</span>
      </div>
    </div>

    <!-- Image Sequence Player -->
    <div 
      v-else-if="showSequence" 
      class="sequence-player"
      @click="skipSequence"
    >
      <img 
        :src="currentImage" 
        :alt="`Frame ${currentFrame}`"
        class="sequence-frame"
      />
      <div class="sequence-overlay">
        <div class="sequence-controls">
          <span class="frame-counter">FRAME {{ String(currentFrame).padStart(3, '0') }} / {{ totalFrames }}</span>
          <span class="skip-hint">[ CLICK TO SKIP ]</span>
        </div>
      </div>
    </div>

    <!-- Holographic Main Page -->
    <div v-else class="holographic-page">
      <!-- Background Effects -->
      <div class="holo-grid"></div>
      <div class="holo-scanlines"></div>
      <div class="holo-vignette"></div>
      <div class="holo-dark-overlay"></div>
      
      <!-- Particles -->
      <div class="particles-container">
        <div 
          v-for="n in 30" 
          :key="n"
          class="particle"
          :style="getParticleStyle(n)"
        ></div>
      </div>

      <!-- Main Content -->
      <div class="holo-content">
        <!-- Left Side: Holographic Text -->
        <div class="holo-text-panel">
          <div class="holo-header">
            <div class="holo-tag">VISUAL_NOVEL_ENGINE // V.0.9.7</div>
            <h1 class="holo-title">
              <span class="title-line">STEM</span>
              <span class="title-line accent">'A'</span>
              <span class="title-line">PLAY</span>
            </h1>
          </div>

          <div class="holo-status-box">
            <div class="status-header">
              <span class="status-indicator"></span>
              <span class="status-text">SYSTEM STATUS: UNDER CONSTRUCTION</span>
            </div>
            <div class="holo-divider"></div>
            <p class="holo-description">
              A cyberpunk-buddhist Visual Novel based on the Avatamsaka Sutra (STEM ARRAY).
              Guided by <span class="highlight">Cybermanju AI</span>, users journey through
              the infinite interconnectedness of all phenomena, democratizing ancient wisdom
              through interactive storytelling.
            </p>
          </div>

          <div class="holo-features">
            <div class="feature-item">
              <span class="feature-icon">◈</span>
              <span class="feature-text">DECISION_BRANCHING_NARRATIVE</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">◈</span>
              <span class="feature-text">AI_DRIVEN_DHARMIC_GUIDANCE</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">◈</span>
              <span class="feature-text">MULTI_PLATFORM_DEPLOYMENT</span>
            </div>
          </div>

          <div class="holo-infrastructure">
            <div class="infra-header">INFRASTRUCTURE_BUILD_LOG</div>
            <div class="infra-logs">
              <div 
                v-for="(log, index) in infrastructureLogs" 
                :key="index"
                class="infra-log"
                :class="{ 'log-new': index === infrastructureLogs.length - 1 }"
              >
                <span class="log-time">{{ log.time }}</span>
                <span class="log-message">{{ log.message }}</span>
              </div>
            </div>
          </div>

          <div class="holo-actions">
            <button class="holo-btn primary" @click="notifyComingSoon">
              <span class="btn-icon">▶</span>
              <span class="btn-text">ENTER_PREVIEW</span>
            </button>
            <button class="holo-btn secondary" @click="goBack">
              <span class="btn-icon">←</span>
              <span class="btn-text">RETURN</span>
            </button>
          </div>
        </div>

        <!-- Right Side: 3D Character -->
        <div class="holo-character-panel">
          <div class="character-container">
            <canvas ref="characterCanvas" class="character-canvas"></canvas>
            <div class="character-overlay">
              <div class="character-label">SAMANTABHADRA_BODHISATTVA</div>
              <div class="character-status">[ HOLOGRAM_ACTIVE ]</div>
            </div>
            <div class="character-glow"></div>
            <div v-if="!modelLoaded" class="character-loading">
              LOADING MODEL... {{ Math.floor(modelLoadProgress) }}%
            </div>
          </div>
          
          <!-- Decorative Elements -->
          <div class="holo-rings">
            <div class="ring ring-1"></div>
            <div class="ring ring-2"></div>
            <div class="ring ring-3"></div>
          </div>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="holo-footer">
        <div class="footer-left">
          <span class="footer-tag">BHUMISPARSHA_SCHOOL // 2027</span>
          <span class="footer-divider">|</span>
          <span class="footer-tag">KHYENTSE_FOUNDATION_COLLABORATION</span>
        </div>
        <div class="footer-right">
          <span class="footer-status glitch-text">BUILDING_CONSCIOUSNESS_INFRASTRUCTURE</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const router = useRouter()

// Loading state
const isLoading = ref(true)
const loadingProgress = ref(0)
const loadedImages = ref(0)
const totalImages = 111 // INTRO_000 to INTRO_110

// Sequence state
const showSequence = ref(false)
const currentFrame = ref(0)
const sequenceImages = ref([])
const sequenceInterval = ref(null)

// 3D Character
const characterCanvas = ref(null)
const modelLoaded = ref(false)
const modelLoadProgress = ref(0)
let scene, camera, renderer, character, animationId, fallbackMesh

// Infrastructure logs
const infrastructureLogs = ref([
  { time: '00:00:01', message: 'INITIALIZING_CORE_SYSTEMS...' },
  { time: '00:00:03', message: 'LOADING_SUTRA_DATABASE... OK' },
  { time: '00:00:07', message: 'CONNECTING_CYBERMANJU_AI... OK' },
  { time: '00:00:12', message: 'RENDERING_PIPELINE_ESTABLISHED' },
  { time: '00:00:18', message: 'BUILDING_VISUAL_NOVEL_FRAMEWORK...' },
])

// Generate image URLs
const generateImageUrls = () => {
  const urls = []
  for (let i = 0; i <= 110; i++) {
    const num = String(i).padStart(3, '0')
    urls.push(`${import.meta.env.BASE_URL}intro/INTRO_${num}.webp`)
  }
  return urls
}

// Preload images
const preloadImages = async () => {
  const urls = generateImageUrls()
  const promises = urls.map((url) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        loadedImages.value++
        loadingProgress.value = (loadedImages.value / totalImages) * 100
        resolve(url)
      }
      img.onerror = () => {
        loadedImages.value++
        loadingProgress.value = (loadedImages.value / totalImages) * 100
        resolve(url)
      }
      img.src = url
    })
  })
  
  sequenceImages.value = await Promise.all(promises)
}

// Current image in sequence
const currentImage = computed(() => {
  return sequenceImages.value[currentFrame.value] || ''
})

const totalFrames = computed(() => sequenceImages.value.length)

// Start sequence playback
const startSequence = () => {
  showSequence.value = true
  currentFrame.value = 0
  
  sequenceInterval.value = setInterval(() => {
    currentFrame.value++
    if (currentFrame.value >= sequenceImages.value.length - 1) {
      clearInterval(sequenceInterval.value)
      setTimeout(() => {
        showSequence.value = false
      }, 500)
    }
  }, 83) // ~12fps for cinematic feel
}

// Skip sequence
const skipSequence = () => {
  if (sequenceInterval.value) {
    clearInterval(sequenceInterval.value)
  }
  showSequence.value = false
}

// Initialize 3D Character
const initCharacter = () => {
  if (!characterCanvas.value) return
  
  const canvas = characterCanvas.value
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  
  // Scene
  scene = new THREE.Scene()
  
  // Camera - positioned to see the model better
  camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
  camera.position.set(0, 0, 5)
  camera.lookAt(0, 0, 0)
  
  // Renderer
  renderer = new THREE.WebGLRenderer({ 
    canvas, 
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  
  // Multiple lights for better visibility
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)
  
  const mainLight = new THREE.DirectionalLight(0x00ffaa, 1.5)
  mainLight.position.set(5, 5, 5)
  scene.add(mainLight)
  
  const fillLight = new THREE.DirectionalLight(0x00d4ff, 1)
  fillLight.position.set(-5, 0, 5)
  scene.add(fillLight)
  
  const backLight = new THREE.DirectionalLight(0xff00ff, 0.8)
  backLight.position.set(0, 5, -5)
  scene.add(backLight)
  
  // Point lights for holographic effect
  const pointLight1 = new THREE.PointLight(0x00ffaa, 1, 10)
  pointLight1.position.set(2, 2, 2)
  scene.add(pointLight1)
  
  const pointLight2 = new THREE.PointLight(0xff00ff, 1, 10)
  pointLight2.position.set(-2, -2, 2)
  scene.add(pointLight2)
  
  // Create fallback geometric shape (always visible as aura/structure)
  const geometry = new THREE.TorusKnotGeometry(0.8, 0.2, 128, 32)
  const material = new THREE.MeshPhongMaterial({ 
    color: 0x00ffaa,
    emissive: 0x00d4ff,
    emissiveIntensity: 0.4,
    transparent: true,
    opacity: 0.4,
    wireframe: true,
    side: THREE.DoubleSide
  })
  fallbackMesh = new THREE.Mesh(geometry, material)
  fallbackMesh.position.set(0, 0, 0)
  fallbackMesh.scale.set(0.8, 0.8, 0.8)
  scene.add(fallbackMesh)
  
  // Load GLB Model with better error handling
  const loader = new GLTFLoader()
  const modelPath = import.meta.env.BASE_URL + 'samantabhadra.glb'
  
  loader.load(
    modelPath,
    (gltf) => {
      // Success callback
      character = gltf.scene
      
      // Calculate bounding box to center and scale the model
      const box = new THREE.Box3().setFromObject(character)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      
      // Reset position to center
      character.position.x = -center.x
      character.position.y = -center.y
      character.position.z = -center.z
      
      // Scale to fit in view (max dimension should be ~2 units)
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 2.5 / maxDim
      character.scale.set(scale, scale, scale)
      
      // Apply holographic material effect to all meshes
      character.traverse((child) => {
        if (child.isMesh) {
          // Clone material to avoid affecting other instances
          child.material = child.material.clone()
          child.material.transparent = true
          child.material.opacity = 0.9
          child.material.emissive = new THREE.Color(0x00ffaa)
          child.material.emissiveIntensity = 0.2
          child.material.side = THREE.DoubleSide
        }
      })
      
      scene.add(character)
      modelLoaded.value = true
    },
    (progress) => {
      // Progress callback
      if (progress.total > 0) {
        modelLoadProgress.value = (progress.loaded / progress.total) * 100
      }
    },
    (_error) => {
      // Error callback
      modelLoaded.value = true
    }
  )
  
  // Animation loop
  const animate = () => {
    animationId = requestAnimationFrame(animate)
    
    const time = Date.now() * 0.001
    
    if (fallbackMesh) {
      fallbackMesh.rotation.x = time * 0.2
      fallbackMesh.rotation.y = time * 0.3
    }
    
    if (character) {
      character.rotation.y = time * 0.1
      // Subtle floating animation
      character.position.y = Math.sin(time * 0.5) * 0.1
    }
    
    renderer.render(scene, camera)
  }
  animate()
}

// Particle styles
const getParticleStyle = (_n) => {
  const randomX = Math.random() * 100
  const randomY = Math.random() * 100
  const randomDelay = Math.random() * 5
  const randomDuration = 3 + Math.random() * 4
  
  return {
    left: `${randomX}%`,
    top: `${randomY}%`,
    animationDelay: `${randomDelay}s`,
    animationDuration: `${randomDuration}s`
  }
}

// Add new log periodically
const addLog = () => {
  const logs = [
    'OPTIMIZING_RENDER_ENGINE...',
    'TRAINING_NLP_MODEL...',
    'GENERATING_ASSET_PIPELINES...',
    'SYNCING_DHARMIC_DATABASE...',
    'CALIBRATING_AI_PERSONALITY...',
    'COMPILING_STEM_ARRAY_MODULES...',
  ]
  
  const now = new Date()
  const time = now.toTimeString().split(' ')[0]
  const message = logs[Math.floor(Math.random() * logs.length)]
  
  infrastructureLogs.value.push({ time, message })
  if (infrastructureLogs.value.length > 6) {
    infrastructureLogs.value.shift()
  }
}

// Navigation
const goBack = () => {
  router.push('/')
}

const notifyComingSoon = () => {
  alert('Preview mode coming soon! Infrastructure still building...')
}

// Lifecycle
onMounted(async () => {
  // Preload images
  await preloadImages()
  
  // Hide loading, start sequence
  setTimeout(() => {
    isLoading.value = false
    startSequence()
  }, 500)
  
  // Initialize 3D when sequence ends
  const checkSequence = setInterval(() => {
    if (!showSequence.value && !isLoading.value) {
      clearInterval(checkSequence)
      initCharacter()
    }
  }, 100)
  
  // Add logs periodically
  const logInterval = setInterval(addLog, 4000)
  
  // Cleanup
  onUnmounted(() => {
    clearInterval(logInterval)
    if (sequenceInterval.value) clearInterval(sequenceInterval.value)
    if (animationId) cancelAnimationFrame(animationId)
    if (renderer) renderer.dispose()
  })
})
</script>

<style scoped>
.stemaplay-view {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #020202;
  position: relative;
}

/* Loading Screen */
.loading-screen {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #020202;
  font-family: 'JetBrains Mono', monospace;
}

.loading-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loading-line {
  color: var(--neon-mint);
  font-size: 14px;
  letter-spacing: 4px;
  text-shadow: 0 0 10px var(--neon-mint);
}

.loading-bar {
  width: 300px;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.loading-progress {
  height: 100%;
  background: var(--neon-mint);
  box-shadow: 0 0 10px var(--neon-mint);
  transition: width 0.1s linear;
}

.loading-percent {
  color: var(--cyber-blue);
  font-size: 24px;
  font-weight: bold;
}

/* Sequence Player */
.sequence-player {
  width: 100%;
  height: 100%;
  position: relative;
  background: #000;
  cursor: pointer;
}

.sequence-frame {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.sequence-overlay {
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 40px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.sequence-controls {
  display: flex;
  gap: 40px;
}

.skip-hint {
  color: var(--neon-mint);
  text-shadow: 0 0 5px var(--neon-mint);
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Holographic Page */
.holographic-page {
  width: 100%;
  height: 100%;
  position: relative;
  background: 
    radial-gradient(circle at 50% 50%, rgba(10, 10, 15, 1) 0%, rgba(2, 2, 2, 1) 100%),
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  background-blend-mode: overlay;
  overflow: hidden;
}

.holo-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: 50px 50px;
  background-image:
    linear-gradient(to right, rgba(0, 255, 170, 0.02) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 255, 170, 0.02) 1px, transparent 1px);
  pointer-events: none;
}

.holo-scanlines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.2) 50%);
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 10;
}

.holo-vignette {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, transparent 30%, rgba(0, 0, 0, 0.9) 100%);
  pointer-events: none;
}

.holo-dark-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  pointer-events: none;
  z-index: 1;
}

/* Particles */
.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: var(--neon-mint);
  border-radius: 50%;
  opacity: 0;
  animation: float-particle 4s infinite;
}

@keyframes float-particle {
  0% {
    opacity: 0;
    transform: translateY(0) scale(0);
  }
  20% {
    opacity: 0.6;
    transform: translateY(-20px) scale(1);
  }
  80% {
    opacity: 0.6;
    transform: translateY(-100px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-120px) scale(0);
  }
}

/* Main Content */
.holo-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  height: calc(100% - 60px);
  padding: 30px 40px 0;
  position: relative;
  z-index: 5;
  overflow: hidden;
}

/* Left Panel */
.holo-text-panel {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 16px;
  padding-top: 10px;
  overflow: hidden;
}

.holo-header {
  border-left: 2px solid var(--neon-mint);
  padding-left: 15px;
  flex-shrink: 0;
}

.holo-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--neon-mint);
  letter-spacing: 2px;
  margin-bottom: 5px;
}

.holo-title {
  font-family: 'Outfit', sans-serif;
  font-size: 3rem;
  line-height: 0.9;
  margin: 0;
}

.title-line {
  display: block;
  background: linear-gradient(90deg, #fff, #00ffaa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title-line.accent {
  background: linear-gradient(90deg, #ff00ff, #00d4ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.holo-status-box {
  background: rgba(0, 255, 170, 0.03);
  border: 1px solid rgba(0, 255, 170, 0.2);
  padding: 12px 15px;
  backdrop-filter: blur(5px);
  flex-shrink: 0;
}

.status-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
}

.status-indicator {
  width: 6px;
  height: 6px;
  background: #ffff00;
  border-radius: 50%;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.status-text {
  color: #ffff00;
}

.holo-divider {
  height: 1px;
  background: linear-gradient(90deg, var(--neon-mint), transparent);
  margin: 10px 0;
}

.holo-description {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 12px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.highlight {
  color: var(--neon-mint);
  font-weight: bold;
}

.holo-features {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.6);
}

.feature-icon {
  color: var(--cyber-blue);
  font-size: 8px;
}

.holo-infrastructure {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 10px 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  flex-shrink: 0;
}

.infra-header {
  color: var(--hologram-pink);
  margin-bottom: 8px;
  letter-spacing: 1px;
  font-size: 8px;
}

.infra-logs {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.infra-log {
  display: flex;
  gap: 10px;
  color: rgba(255, 255, 255, 0.5);
}

.log-time {
  color: var(--neon-mint);
  opacity: 0.7;
}

.log-new {
  animation: fade-in 0.3s ease;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}

.holo-actions {
  display: flex;
  gap: 12px;
  margin-top: auto;
  padding-bottom: 10px;
  flex-shrink: 0;
}

.holo-btn {
  padding: 10px 18px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
}

.holo-btn.primary {
  background: var(--neon-mint);
  color: #000;
}

.holo-btn.primary:hover {
  background: #fff;
  box-shadow: 0 0 15px var(--neon-mint);
}

.holo-btn.secondary {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.holo-btn.secondary:hover {
  border-color: var(--neon-mint);
  color: var(--neon-mint);
}

.btn-icon {
  font-size: 9px;
}

/* Right Panel - Character */
.holo-character-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100%;
}

.character-container {
  width: 100%;
  height: 90%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.character-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.character-overlay {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
}

.character-label {
  font-size: 9px;
  color: var(--cyber-blue);
  letter-spacing: 2px;
}

.character-status {
  font-size: 8px;
  color: var(--neon-mint);
  margin-top: 3px;
}

.character-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(0, 255, 170, 0.15) 0%, transparent 70%);
  pointer-events: none;
  animation: glow-pulse 3s infinite;
}

.character-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--neon-mint);
  letter-spacing: 2px;
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.1); }
}

/* Decorative Rings */
.holo-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  height: 350px;
  pointer-events: none;
}

.ring {
  position: absolute;
  border: 1px solid rgba(0, 255, 170, 0.15);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.ring-1 {
  width: 250px;
  height: 250px;
  animation: rotate-ring 20s linear infinite;
}

.ring-2 {
  width: 300px;
  height: 300px;
  animation: rotate-ring 25s linear infinite reverse;
}

.ring-3 {
  width: 350px;
  height: 350px;
  animation: rotate-ring 30s linear infinite;
}

@keyframes rotate-ring {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* Footer */
.holo-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  z-index: 20;
  background: rgba(0, 0, 0, 0.5);
}

.footer-left {
  display: flex;
  gap: 10px;
  align-items: center;
}

.footer-tag {
  color: rgba(255, 255, 255, 0.4);
}

.footer-divider {
  color: rgba(255, 255, 255, 0.15);
}

.footer-status {
  color: var(--hologram-pink);
}

.glitch-text {
  animation: glitch 2s infinite;
}

@keyframes glitch {
  0%, 90%, 100% { 
    text-shadow: 2px 0 var(--hologram-pink), -2px 0 var(--cyber-blue);
  }
  92% { 
    text-shadow: -2px 0 var(--hologram-pink), 2px 0 var(--cyber-blue);
  }
  94% { 
    text-shadow: 2px 0 var(--hologram-pink), -2px 0 var(--cyber-blue);
  }
}

/* Responsive */
@media (max-width: 1200px) {
  .holo-content {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 20px;
    height: calc(100% - 50px);
  }
  
  .holo-text-panel {
    gap: 12px;
    padding-top: 0;
  }
  
  .holo-character-panel {
    display: none;
  }
  
  .holo-title {
    font-size: 2.5rem;
  }
  
  .holo-description {
    font-size: 11px;
  }
  
  .holo-footer {
    padding: 12px 20px;
  }
}

@media (max-width: 768px) {
  .holo-content {
    padding: 15px;
    gap: 10px;
  }
  
  .holo-title {
    font-size: 2rem;
  }
  
  .holo-tag {
    font-size: 8px;
  }
  
  .holo-description {
    font-size: 10px;
    line-height: 1.5;
  }
  
  .holo-status-box {
    padding: 10px 12px;
  }
  
  .holo-infrastructure {
    padding: 8px 10px;
  }
  
  .feature-item {
    font-size: 8px;
  }
  
  .holo-actions {
    gap: 8px;
  }
  
  .holo-btn {
    padding: 8px 12px;
    font-size: 8px;
  }
  
  .holo-footer {
    padding: 10px 15px;
    font-size: 8px;
  }
  
  .footer-left {
    gap: 6px;
  }
  
  .sequence-overlay {
    padding: 0 15px;
    flex-direction: column;
    gap: 5px;
    font-size: 10px;
  }
}

@media (max-width: 480px) {
  .holo-title {
    font-size: 1.8rem;
  }
  
  .holo-content {
    padding: 10px;
  }
  
  .loading-line {
    font-size: 12px;
  }
  
  .loading-bar {
    width: 250px;
  }
}
</style>
