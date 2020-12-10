import Header from '../components/header/header';

import buildClient from '../api/build-client';

import 'bootstrap/dist/css/bootstrap.css';

const AppComponent = ({ Component, pageProps, currentUser }) => (
  <div>
    <Header currentUser={currentUser} />
    <div className="container">
      <Component currentUser={currentUser} {...pageProps} />
    </div>
  </div>
);

AppComponent.getInitialProps = async (appContext) => {
  const { ctx } = appContext;
  const client = buildClient(ctx);
  const { data } = await client.get('/api/users/currentUser');
  if (appContext.Component.getInitialProps) {
    const pageProps = await appContext.Component.getInitialProps(
      ctx,
      client,
      data.currentUser
    );
    return {
      pageProps,
      ...data,
    };
  }
  return {
    ...data,
  };
};

export default AppComponent;
