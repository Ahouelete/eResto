export const environment = {
  production: true,
  expirationTime: 5000,
  //backend: 'https://backend-srh.impots.bj/api',
  //backend: 'http://172.20.10.2:8080/api',
  //backend: 'http://192.168.137.99:8080/api',
  backend: '127.0.0.1:8080/api',
  pusher: {
    key: '64bd30fd9bc82e487c69',
    clusters: {
      cluster: 'eu',
      encrypted: true,
    },
  },
};
