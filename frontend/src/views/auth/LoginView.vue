<template>
  <section class="login">
    <h1>Login</h1>
    <form v-on:submit="sendForm" id="login_form">
      <div>
        <label for="">Nome</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder="email"
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
          placeholder="minimo 6 char"
          minlength="6"
          :disabled="loading"
        />
      </div>
      <Loading :loading="loading">
        <div class="action">
          <button type="submit">Enviar</button>
          <button type="reset">Resetar</button>
        </div>
      </Loading>
      <a @click="router.push('/signin')">Crie uma conta</a>
    </form>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import axiosInstance from '../../axios'
import eventBus from '../../eventBus/index'
import { ref } from 'vue'
import Loading from '@/components/global/Loading.vue'

const router = useRouter()
const loading = ref(false)

const sendForm = async (e: Event) => {
  e.preventDefault()
  const formData = new FormData(e.target as HTMLFormElement)
  const formObject = Object.fromEntries(formData.entries())
  loading.value = true
  axiosInstance
    .post('/login', formObject)
    .then(({ data }) => {
      localStorage.setItem('USER_TOKEN', data.token)
      localStorage.setItem('USER_DATA', JSON.stringify(data.user))
      eventBus.$emit('userLogin', '')
      router.push('/')
    })
    .catch((error) => {
      console.error('Error:', error?.response?.data)
      if (error?.response?.data?.errors) {
        alert(error?.response?.data?.errors[0]?.msg)
      } else {
        alert('Erro ao logar usuario')
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
