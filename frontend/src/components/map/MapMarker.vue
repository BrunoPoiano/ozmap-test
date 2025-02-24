<template>
  <div class="map_wrapper">
    <GoogleMap
      style="width: 100%; height: 500px"
      id="map"
      :api-key="googleApi"
      :center="center"
      :zoom="15"
    >
      <Marker :options="markerOptions" />
    </GoogleMap>
  </div>
</template>
<script lang="ts">
import { GoogleMap, Marker } from 'vue3-google-map'

type Coordinates = { lat: number; lng: number }

export default {
  components: {
    GoogleMap,
    Marker,
  },
  props: {
    coordinates: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      show: false,
      googleApi: import.meta.env.VITE_GEOCODING_API_KEY,
      center: <Coordinates>{
        lat: Number(this.coordinates[0]),
        lng: Number(this.coordinates[1]),
      },
      markerOptions: {
        position: <Coordinates>{ lat: this.coordinates[0], lng: this.coordinates[1] },
        label: 'L',
        title: '',
      },
    }
  },
  watch: {
    coordinates() {
      const position: Coordinates = {
        lat: Number(this.coordinates[0]),
        lng: Number(this.coordinates[1]),
      }

      this.center = position
      this.markerOptions = {
        position: position,
        label: 'L',
        title: 'User',
      }
    },
  },
}
</script>
