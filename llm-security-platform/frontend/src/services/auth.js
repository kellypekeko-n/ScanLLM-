export const auth = {
  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },
  login(token = 'demo-token') {
    localStorage.setItem('auth_token', token);
  },
  logout() {
    localStorage.removeItem('auth_token');
  },
};
