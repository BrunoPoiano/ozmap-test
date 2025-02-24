<template>
  <button data-bg-default v-if="action == 'create'" @click="openModal">Criar Regiao</button>
  <button data-bg-atention v-if="action == 'edit'" @click="openModal">Editar</button>
  <Teleport to="body">
    <dialog :id="dialogId" style="max-width: 50ch">
      <button data-modal-close @click="closeModal">X</button>
      <form @submit.prevent="sendForm">
        <div>
          <label for="name">Nome:</label>
          <input type="text" id="name" name="name" v-model="form.name" required />
        </div>
        <div>
          <div
            class="coordinateForm"
            v-for="(coordinate, index) in form.coordinates"
            v-bind:key="index"
            :data-index="index"
          >
            <div>
              <label :for="`lat-${index}`">Latitude</label>
              <input
                type="number"
                step="any"
                :id="`lat-${index}`"
                v-model="coordinate[0]"
                placeholder="Latitude"
              />
            </div>
            <div>
              <label :for="`lng-${index}`">Longitude</label>
              <input
                type="number"
                step="any"
                :id="`lng-${index}`"
                v-model="coordinate[1]"
                placeholder="Longitude"
              />
            </div>
            <button data-bg-danger data-btn-svg type="button" @click="removeCoordinate(index)">
              <TrashCan size="20px" />
            </button>
          </div>
          <div class="coordinateForm" v-if="form.coordinates.length > 1">
            <div>
              <label for="lat">Latitude</label>
              <input
                disabled
                type="number"
                step="any"
                id="lat"
                v-model="form.coordinates[0][0]"
                placeholder="Latitude"
              />
            </div>
            <div>
              <label for="lgn">Longitude</label>
              <input
                disabled
                type="number"
                step="any"
                id="lgn"
                v-model="form.coordinates[0][1]"
                placeholder="Longitude"
              />
            </div>
          </div>

          <button type="button" @click="addCoordinate">Adicionar Coordenada</button>
        </div>

        <div class="action">
          <button type="submit">Enviar</button>
          <button type="reset">Resetar</button>
        </div>
      </form>
    </dialog>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import axiosInstance from '@/axios'
import type { Region } from '../Index.vue'
import TrashCan from '@/components/global/svgs/TrashCan.vue'

type FormState = {
  name: string
  coordinates: [number, number][]
}

export default defineComponent({
  components: {
    TrashCan,
  },
  props: {
    action: {
      type: String,
      default: 'create',
    },
    content: {
      type: Object as () => Region,
    },
  },
  data() {
    return {
      form: {
        name: '',
        coordinates: [],
      } as FormState,
    }
  },
  computed: {
    dialogId() {
      if (this.action === 'create') {
        return 'dialog_create_region'
      }
      if (this.content) {
        return `dialog_edit_region_${this.content._id}`
      }
      return 'dialog_region'
    },
  },
  methods: {
    addCoordinate() {
      this.form.coordinates.push([0, 0])
    },
    removeCoordinate(index: number) {
      this.form.coordinates.splice(index, 1)
    },
    sendForm(event: Event) {
      event.preventDefault()
      const params = JSON.parse(JSON.stringify(this.form))

      if (params.coordinates.length < 3) {
        alert('Regiao deve ter pelo menos 3 coordenadas!')
        return
      }

      params.coordinates.push(params.coordinates[0])
      params.coordinates = [params.coordinates]

      switch (this.action) {
        case 'create':
          axiosInstance.post('region', params).then(() => {
            alert('Regiao criada com sucesso!')
            this.form = { name: '', coordinates: [] }
            this.closeModal()
            this.$emit('refreshRegions')
          })
          break
        case 'edit':
          axiosInstance.put(`region/${this.content?._id}`, params).then(() => {
            alert('Regiao atualizada com sucesso!')
            this.form = { name: '', coordinates: [] }
            this.closeModal()
            this.$emit('refreshRegions')
          })
          break
      }
    },
    openModal() {
      if (this.content) {
        const geoJson = this.content.geojson.coordinates.flat()
        geoJson.pop()
        this.form = {
          name: this.content.name,
          coordinates: geoJson,
        }
      }

      const dialog = document.getElementById(this.dialogId) as HTMLDialogElement
      dialog?.showModal()
    },
    closeModal() {
      const dialog = document.getElementById(this.dialogId) as HTMLDialogElement
      dialog?.close()
      this.form = {
        name: '',
        coordinates: [],
      }
    },
  },
})
</script>

<style scoped>
.coordinateForm {
  display: flex;
  align-items: last baseline;
  gap: 1rem;

  input {
    min-width: min(10ch, 100%);
  }
}
</style>
