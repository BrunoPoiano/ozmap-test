<template>
  <div class="loading" v-if="loading">
    <div class="spinner"></div>
  </div>
  <slot v-else></slot>
</template>

<script lang="ts">
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #000;
  border-radius: 50%;
  width: 30px;
  aspect-ratio: 1;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
