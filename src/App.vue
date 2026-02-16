<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
// Router view handles all navigation
</script>

<style>
:root {
  --ink: #050505;
  --neon-mint: #00ffaa;
  --hologram-pink: #ff00ff;
  --cyber-blue: #00d4ff;
  --iridescent: linear-gradient(90deg, #ff00ff, #00d4ff, #00ffaa, #ffff00, #ff00ff);
  --brutal-shadow: 6px 6px 0px rgba(0, 0, 0, 1);
  --glass: rgba(255, 255, 255, 0.03);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  cursor: crosshair;
}

body {
  background-color: var(--ink);
  color: #fff;
  font-family: 'Space Grotesk', sans-serif;
  overflow: hidden;
}

#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* Global scrollbar styling for internal pages */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
}

::-webkit-scrollbar-thumb {
  background: var(--neon-mint);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--cyber-blue);
}
</style>
