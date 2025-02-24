<template>
  <div class="dashboard">
    <div class="title">
      <h2>Regiões</h2>

      <RegionsForm action="create" @refreshRegions="getRegions" />
    </div>

    <div class="filter">
      <div>
        <label for="">Pesquise por</label>
        <select name="type_search" v-model="filter.search_type" :onchange="getRegions">
          <option value="name">Nome</option>
          <option value="point">Ponto</option>
          <option value="point_near">Ponto mais proximo</option>
        </select>
      </div>

      <div v-if="filter.search_type === 'name'">
        <label for="">Nome da região</label>
        <input type="text" placeholder="Pesquisar" v-model="filter.search" :onkeyup="getRegions" />
      </div>

      <div v-if="filter.search_type === 'point' || filter.search_type === 'point_near'">
        <label for="">Latitude</label>
        <input
          type="number"
          steps="any"
          placeholder="Latitude"
          v-model="filter.latitude"
          :onkeyup="getRegions"
        />
      </div>
      <div v-if="filter.search_type === 'point' || filter.search_type === 'point_near'">
        <label for="">Longitude</label>
        <input
          type="number"
          steps="any"
          placeholder="Longitude"
          v-model="filter.longitude"
          :onkeyup="getRegions"
        />
      </div>

      <div v-if="filter.search_type === 'point_near'">
        <label for="">Distancia</label>
        <input
          type="number"
          placeholder="Distancia"
          v-model="filter.distance"
          :onkeyup="getRegions"
        />
      </div>
      <div v-if="filter.search_type === 'point_near'">
        <label for="">Todas as regiões</label>
        <input
          type="checkbox"
          placeholder="searchAll"
          v-model="filter.searchAll"
          :checked="filter.searchAll"
          :onchange="getRegions"
        />
      </div>
      <button type="button" @click="clearFilter">Limpar Filtro</button>
    </div>
    <Accordion :content="regions" @refreshRegions="getRegions" />
  </div>
</template>

<script setup lang="ts">
import Accordion from './components/Accordion.vue'
import axiosInstance from '@/axios'
import { onMounted, ref } from 'vue'
import RegionsForm from './components/RegionsForm.vue'

export type Region = {
  _id: string
  name: string
  geojson: GeoJson
  userDetails?: { _id: string; name: string }[]
}
type GeoJson = {
  type: string
  coordinates: [[[Coordinates]]]
}
type Coordinates = [number, number]

const debounced = ref(null)
const filter = ref({
  search_type: 'name',
  search: '',
  latitude: null,
  longitude: null,
  distance: 1000,
  searchAll: false,
})
const regions = ref<Region[]>([])

const debounce = (delay: number, func: Function): Function => {
  return () => {
    if (debounced.value) {
      clearTimeout(debounced.value)
    }

    debounced.value = setTimeout(() => {
      func()
    }, delay)
  }
}

const getRegions = debounce(500, () => {
  let url = 'region'

  switch (filter.value.search_type) {
    case 'name':
      url = 'region'
      break
    case 'point':
      url = 'region/find'
      break
    case 'point_near':
      url = 'region/find-near'
      break
  }

  if (
    (url === 'region/find' || url === 'region/find-near') &&
    (filter.value.latitude === null || filter.value.longitude === null)
  ) {
    return
  }

  axiosInstance
    .get(url, { params: { ...filter.value } })
    .then(({ data }) => {
      for (const el of data) {
        const coordinates_flat = el.geojson.coordinates.flat()
        el.map_coordinated = coordinates_flat.map((coord: Coordinates) => {
          return {
            lat: coord[0],
            lng: coord[1],
          }
        })
      }
      regions.value = data
    })
    .catch((error) => {
      console.error(error)
    })
})

const clearFilter = () => {
  filter.value = {
    search_type: 'name',
    search: '',
    latitude: null,
    longitude: null,
    distance: 1000,
    searchAll: false,
  }
}

onMounted(() => {
  getRegions()
})
</script>

<style scoped>
.title {
  display: flex;
  align-items: start;
  justify-content: space-between;
  padding: 0.5rem;
}
.dashboard {
  display: grid;
  gap: 2rem;
  .create-item {
    place-self: end;
  }
}

.filter {
  display: flex;
  align-items: last baseline;
  flex-wrap: wrap;
  gap: 1rem;

  > div {
    display: grid;
    gap: 0.5rem;
  }
  button {
    margin-left: auto;
  }
}
</style>
