import TicketsTableRow from './tickets-table-row';

const TicketsTable = ({ tickets }) => {
  const ticketList = tickets.map((ticket) => (
    <TicketsTableRow key={ticket.id} {...ticket} />
  ));

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>{ticketList}</tbody>
    </table>
  );
};

export default TicketsTable;
