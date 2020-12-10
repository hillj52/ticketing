import TicketsTable from '../../components/tickets-table/tickets-table';

const LandingPage = ({ currentUser, tickets }) => (
  <div>
    <h1>Tickets</h1>
    <TicketsTable tickets={tickets} />
  </div>
);

export default LandingPage;
