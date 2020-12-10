import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body = {}, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](url, {
        ...body,
        ...props,
      });
      onSuccess(response.data);

      return response.data;
    } catch (err) {
      console.log(err);
      setErrors(err.response.data.errors);
    }
  };

  return [doRequest, errors];
};

export { useRequest };
