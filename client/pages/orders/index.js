const OrderIndex = ({ orders }) => {
  return (
    <ul>
      {orders.map(({ id, ticket, status }) => (
        <li key={id}>
          {ticket.title} - {status}
        </li>
      ))}
    </ul>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders');

  return { orders: data };
};

export default OrderIndex;
