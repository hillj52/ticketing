import axios from 'axios';

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    const { headers } = req;
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.kube-system.svc.cluster.local',
      headers,
    });
  } else {
    return axios.create({
      baseURL: '/',
    });
  }
};

export default buildClient;
