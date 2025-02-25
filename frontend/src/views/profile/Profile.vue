<template>
  <h2>Dados de Usuario</h2>

  <div class="form">
    <form id="edit_form" v-on:submit="sendForm">
      <div>
        <label for="">Name</label>
        <input
          type="string"
          id="name"
          v-model="userInfo.name"
          name="name"
          required
          placeholder="Name"
          :disabled="loadingForm"
        />
      </div>
      <div>
        <label for="">Email</label>
        <input
          type="email"
          id="email"
          v-model="userInfo.email"
          name="email"
          required
          placeholder="Email"
          :disabled="loadingForm"
        />
      </div>
      <div>
        <label for="">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          v-model="userInfo.new_password"
          placeholder="Minimo 6 characters"
          minlength="6"
          :disabled="loadingForm"
        />
        <small data-danger>Edit to change the current password</small>
      </div>
      <div>
        <label for="">Address</label>
        <input
          type="string"
          id="address"
          v-model="userInfo.address"
          name="address"
          required
          placeholder="address"
          :disabled="loadingForm"
        />
      </div>
      <div class="action">
        <Loading :loading="loadingForm">
          <button type="submit">Enviar</button>
        </Loading>
      </div>
    </form>
    <MapMarker v-if="userInfo.coordinates.length == 2" :coordinates="userInfo.coordinates" />
    <div class="deleteAccountButton">
      <button @click="deleteAccount" :disabled="loadingDelete">Delete Account</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance from '../../axios'
import Loading from '@/components/global/Loading.vue'
import MapMarker from '@/components/map/MapMarker.vue'

type User = {
  id: string
  email: string
  name: string
  address: string
  new_password: string
  coordinates: [number, number]
}

const userInfo = ref<User>(JSON.parse(localStorage.getItem('USER_DATA') || '{}'))
const router = useRouter()
const loadingForm = ref(false)
const loadingDelete = ref(false)

const deleteAccount = () => {
  loadingDelete.value = true
  axiosInstance
    .delete('/user')
    .then(() => {
      localStorage.removeItem('USER_TOKEN')
      localStorage.removeItem('USER_DATA')
      router.push('/login')
    })
    .catch((error) => {
      console.error('Error:', error.response ? error.response.data : error.message)
    })
    .finally(() => {
      loadingDelete.value = false
    })
}

const sendForm = async (e: Event) => {
  e.preventDefault()
  const formData = new FormData(e.target as HTMLFormElement)
  const formObject = Object.fromEntries(formData.entries())

  loadingForm.value = true
  axiosInstance
    .put('/user', formObject)
    .then(({ data }) => {
      alert('Salvo com sucesso!')
      localStorage.setItem('USER_DATA', JSON.stringify(data.user))
      userInfo.value = data.user
    })
    .catch((error) => {
      if (error.response?.data?.errors[0]) {
        alert(error.response.data.errors[0].msg)
      } else {
        alert('Erro ao salvar!')
      }
      console.error('Error:', error.response.data)
      userInfo.value = JSON.parse(localStorage.getItem('USER_DATA') || '{}')
    })
    .finally(() => {
      loadingForm.value = false
    })
}
</script>

<style scoped>
.form {
  width: 100%;
  form {
    margin-inline: auto;
    width: min(80ch, 100%);
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(35ch, 100%), 1fr));
    gap: 1rem;

    div {
      display: grid;
      grid-template-rows: subgrid;
      grid-row: span 3;
    }

    .action {
      grid-column: 1 / -1;
      display: flex;
      justify-content: end;
    }
  }
}

.deleteAccountButton {
  display: flex;
  justify-content: flex-end;
  button {
    --bg: var(--danger);
  }
}
</style>
