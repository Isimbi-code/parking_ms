export const setToken = (token) => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');
export const removeToken = () => localStorage.removeItem('token');

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
};

export const isAdmin = () => {
  const user = getUserFromToken();
  return user?.role === 'ADMIN';
};

export const isLoggedIn = () => !!getToken();
