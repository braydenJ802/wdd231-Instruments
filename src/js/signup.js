import { saveUser } from './storage.js'

const form = document.getElementById('signup-form')

form.addEventListener('submit', e => {
  e.preventDefault()
  const name = document.getElementById('name').value.trim()
  const email = document.getElementById('email').value.trim()
  saveUser({ name, email })
  window.location.href = `index.html?name=${encodeURIComponent(name)}`
})
