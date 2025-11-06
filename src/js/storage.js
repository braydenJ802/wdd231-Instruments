export function saveUser(user) {
  localStorage.setItem('chordcloudUser', JSON.stringify(user))
}

export function getUser() {
  return JSON.parse(localStorage.getItem('chordcloudUser'))
}
