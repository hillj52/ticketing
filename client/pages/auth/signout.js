import Router from 'next/router';
import { useEffect } from 'react';
import { useRequest } from '../../hooks/use-request';

const SignOut = () => {
  const [doRequest] = useRequest({
    url: '/api/users/signOut',
    method: 'post',
    onSuccess: () => Router.push('/'),
  });

  useEffect(() => {
    doRequest();
  }, []);
  return <div>Logging Out!</div>;
};

export default SignOut;
