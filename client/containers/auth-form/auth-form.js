import { useState } from 'react';
import Router from 'next/router';

import FormInput from '../../components/form-input/form-input';

import { useRequest } from '../../hooks/use-request';

const AuthForm = ({ formLabel, submitLabel, useRequestURL }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [doRequest, errors] = useRequest({
    url: useRequestURL,
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>{formLabel}</h1>
      <FormInput
        field="email"
        label="Email Address"
        value={email}
        setValue={setEmail}
        errors={errors}
      />
      <FormInput
        field="password"
        label="Password"
        value={password}
        setValue={setPassword}
        type="password"
        errors={errors}
      />
      <button className="btn btn-primary">{submitLabel}</button>
    </form>
  );
};

export default AuthForm;
