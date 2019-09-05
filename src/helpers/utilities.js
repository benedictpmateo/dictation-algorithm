export const match = /[!@#$%^&*()-=,.<>';":{}`]/g
export const formatStr = str => str.replace(match, '').toLowerCase();