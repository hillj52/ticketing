import LandingPage from '../containers/landing-page/landing-page';

const Root = (props) => <LandingPage {...props} />;

Root.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default Root;
