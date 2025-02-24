<template>
  <section class="login">
    <h1>Sign In</h1>
    <form v-on:submit="sendForm" id="signin_form">
      <div>
        <label for="">Nome</label>
        <input
          type="string"
          id="name"
          name="name"
          required
          placeholder="Name"
          :disabled="loading"
        />
      </div>
      <div>
        <label for="">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder="Email"
          :disabled="loading"
        />
      </div>
      <div>
        <label for="">Senha</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Minimo 6 characters"
          minlength="6"
          :disabled="loading"
        />
      </div>
      <div>
        <label for="">Endereço</label>
        <input
          type="string"
          id="address"
          name="address"
          required
          placeholder="address"
          :disabled="loading"
        />
      </div>
      <Loading :loading="loading">
        <div class="action">
          <button type="submit" :disabled="loading">Enviar</button>
          <button type="reset" :disabled="loading">Resetar</button>
        </div>
      </Loading>

      <a @click="router.push('/login')">Já possui uma conta?</a>
    </form>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import axiosInstance from '../../axios'
import { ref } from 'vue'
import Loading from '@/components/global/Loading.vue'

const loading = ref(false)
const router = useRouter()

const sendForm = (e: Event) => {
  e.preventDefault()
  const formData = new FormData(e.target as HTMLFormElement)
  const formObject = Object.fromEntries(formData.entries())

  loading.value = true
  axiosInstance
    .post('/signin', formObject)
    .then(() => {
      router.push('/login')
    })
    .catch((error) => {
      console.error('Error:', error?.response?.data)
      if (error?.response?.data?.errors) {
        alert(error?.response?.data?.errors[0]?.msg)
      } else {
        alert('Erro ao criar usuario')
      }
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<style scoped>
.login {
  display: grid;
  place-items: center;
}
</style>
