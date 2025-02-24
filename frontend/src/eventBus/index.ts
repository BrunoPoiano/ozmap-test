import { reactive } from 'vue'
type EventCallback = (...args: unknown[]) => void

const eventBus = reactive({
  events: {} as Record<string, EventCallback[]>,
  $on(event: string, callback: EventCallback) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  },
  $emit(event: string, ...args: unknown[]) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => callback(...args))
    }
  },
  $off(event: string, callback: EventCallback) {
    if (!this.events[event]) return
    this.events[event] = this.events[event].filter((cb) => cb !== callback)
  },
})

export default eventBus
