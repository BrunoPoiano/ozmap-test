<template>
  <div class="accordion-wrapper">
    <details name="accordion" :id="`region-${item._id}`" v-for="item in content" :key="item._id">
      <summary>{{ item.name }} {{ regionOwner(item) }}</summary>
      <div class="details-content-wrapper">
        <Map :region="item" />
        <div class="actions">
          <RegionsForm action="edit" :content="item" @refreshRegions="$emit('refreshRegions')" />
          <button data-bg-danger @click="DeleteItem(item)">Deletar</button>
        </div>
      </div>
    </details>
  </div>
</template>

<script lang="ts">
import Map from '../../map/MapPolygon.vue'
import axiosInstance from '@/axios'
import RegionsForm from './RegionsForm.vue'
import type { Region } from '../Index.vue'

export default {
  name: 'AppAccordion',
  components: {
    Map,
    RegionsForm,
  },
  props: {
    content: {
      type: Array as () => Region[],
      required: true,
    },
  },
  methods: {
    regionOwner(item: Region) {
      if (item.userDetails) {
        const user = JSON.parse(localStorage.getItem('USER_DATA') || '{}')
        if (user._id !== item.userDetails?.[0]?._id) {
          return ` - ${item.userDetails?.[0]?.name}`
        }
      }

      return ''
    },
    DeleteItem(item: Region) {
      axiosInstance
        .delete(`region/${item._id}`)
        .then(() => {
          alert('Deletado com sucesso')
          this.$emit('refreshRegions')
        })
        .catch((error) => {
          console.error(error)
        })
    },
  },
}
</script>

<style scoped>
.accordion-wrapper {
  display: grid;
  gap: 1rem;
  &:hover > details {
    opacity: 0.5;
  }

  details {
    display: flex;
    cursor: pointer;
    background-color: light-dark(#f5f5f5, #0000002e);
    border-radius: 0.5rem;
    transition: opacity 0.3s ease-in-out;

    .details-content-wrapper {
      padding: 0 0.8rem 1rem 0.8rem;

      .actions {
        padding-top: 1rem;
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
      }
    }

    summary {
      padding: 0.8rem 1rem;
      text-transform: capitalize;
    }

    ::marker {
      content: '';
    }

    &:hover {
      opacity: 1;
      outline: 1px solid var(--default);
    }
  }
}
@keyframes details-show {
  from {
    opacity: 0;
    transform: var(--details-translate, translateY(-0.5em));
  }
}

details[open] > *:not(summary) {
  animation: details-show 300ms ease-in-out;
}
</style>
