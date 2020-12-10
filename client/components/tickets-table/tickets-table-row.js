import Link from 'next/link';

const TicketsTableRow = ({ title, price, id }) => (
  <tr>
    <td>{title}</td>
    <td>{price}</td>
    <td>
      <Link href="/tickets/[ticketId]" as={`/tickets/${id}`}>
        <a>View</a>
      </Link>
    </td>
  </tr>
);

export default TicketsTableRow;
