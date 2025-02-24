<template>
  <button id="mode-toggle" @click="changeColorTheme">
    <span id="sun" data-active="false">
      <Sun />
    </span>

    <span id="moon" data-active="true">
      <Moon />
    </span>
  </button>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Sun from './svgs/Sun.vue'
import Moon from './svgs/Moon.vue'
const colorScheme = ref(localStorage.getItem('theme') || 'dark')

const setColorTheme = () => {
  const moon = document.getElementById('moon')
  const sun = document.getElementById('sun')

  localStorage.setItem('theme', colorScheme.value)
  moon?.setAttribute('data-visible', colorScheme.value === 'light')
  sun?.setAttribute('data-visible', colorScheme.value === 'dark')
  document.documentElement.style.setProperty('color-scheme', colorScheme.value)
}
const changeColorTheme = () => {
  if (colorScheme.value === 'dark') {
    colorScheme.value = 'light'
  } else {
    colorScheme.value = 'dark'
  }
  setColorTheme()
}
onMounted(() => {
  setColorTheme()
})
</script>

<style>
#mode-toggle {
  z-index: 1;
  border: none;
  outline: none;
  background: transparent;
  overflow: hidden;

  position: relative;
  width: 100px;
  height: 40px;

  display: grid;
  place-items: center;

  #sun,
  #moon {
    position: absolute;

    svg {
      transition: transform 2s
        linear(
          0,
          0.013 0.6%,
          0.05 1.2%,
          0.199 2.5%,
          0.395 3.7%,
          0.948 6.7%,
          1.201 8.4%,
          1.289 9.2%,
          1.354 10%,
          1.396 10.8%,
          1.416 11.6%,
          1.418 12.2%,
          1.405 12.9%,
          1.345 14.3%,
          1.258 15.6%,
          1.012 18.8%,
          0.909 20.5%,
          0.851 22%,
          0.826 23.6%,
          0.83 24.8%,
          0.854 26.2%,
          0.996 30.8%,
          1.039 32.5%,
          1.063 34%,
          1.073 35.5%,
          1.061 38.2%,
          0.984 44.4%,
          0.97 47.4%,
          0.973 49.8%,
          1.004 55.8%,
          1.013 59.2%,
          0.995 71%,
          1.002 82.8%,
          1
        );
    }
  }

  #sun {
    svg path {
      stroke: #feff94;
      filter: drop-shadow(0px 0px 3px yellow);
    }

    &[data-visible='false'] svg {
      transform: translateX(-75px);
    }
  }

  #moon {
    svg path {
      stroke: #505050;
      filter: drop-shadow(0px 0px 1px black);
    }

    &[data-visible='false'] svg {
      transform: translateX(75px);
    }
  }
}
</style>
