import { useState } from 'react';
import Router from 'next/router';
import FormInput from '../../components/form-input/form-input';

import { useRequest } from '../../hooks/use-request';

const TicketForm = ({ formLabel, submitLabel }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [doRequest, errors] = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: (ticket) => Router.push('/'),
  });

  const onPriceBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>{formLabel}</h1>
      <FormInput
        field="title"
        label="Title"
        value={title}
        setValue={setTitle}
        errors={errors}
      />
      <FormInput
        field="price"
        label="Price"
        value={price}
        setValue={setPrice}
        onBlur={onPriceBlur}
        errors={errors}
      />
      <button className="btn btn-primary">{submitLabel}</button>
    </form>
  );
};

export default TicketForm;
