function logout() {
  localStorage.removeItem('user');
  alert('Je bent uitgelogd.');
  window.location.href = 'index.html';
}
