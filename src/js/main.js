import { fetchInstruments } from './api.js'
import { renderInstruments } from './ui.js'
import { getUser, saveUser } from './storage.js'

fetchInstruments().then(data => {
  renderInstruments(data)
})

const signupBtn = document.getElementById('signup-btn')
const params = new URLSearchParams(window.location.search)
const nameFromURL = params.get('name')

let userData = getUser()

if (nameFromURL && (!userData || userData.name !== nameFromURL)) {
  userData = { name: nameFromURL }
  saveUser(userData)
}

if (userData && userData.name) {
  signupBtn.textContent = `Hi ${userData.name}, thanks for signing up for our email service!`
} else {
  signupBtn.addEventListener('click', () => {
    window.location.href = 'signup.html'
  })
}

