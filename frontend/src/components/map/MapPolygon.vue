<template>
  <GoogleMap
    v-if="googleApi"
    id="map"
    :api-key="googleApi"
    style="width: 100%; height: 500px"
    :center="center"
    :zoom="5"
  >
    <Polygon :options="polygonOptions" />
  </GoogleMap>
</template>
<script lang="ts">
import { GoogleMap, Polygon } from 'vue3-google-map'
export default {
  components: {
    GoogleMap,
    Polygon,
  },
  props: {
    region: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      googleApi: import.meta.env.VITE_GEOCODING_API_KEY,
      center: { lat: 0, lng: 0 },
      polygonOptions: {
        paths: [],
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
      },
    }
  },
  mounted() {
    let lat = 0
    let lgn = 0
    for (const point of this.region.map_coordinated) {
      lat += point.lat
      lgn += point.lng
    }
    const latCenter = lat / this.region.map_coordinated.length
    const lngCenter = lgn / this.region.map_coordinated.length

    this.center = { lat: latCenter, lng: lngCenter }
    this.polygonOptions.paths = this.region.map_coordinated
  },
}
</script>
