import AuthForm from '../../containers/auth-form/auth-form';

const signup = () => (
  <AuthForm
    formLabel="Sign In"
    submitLabel="Sign In"
    useRequestURL="/api/users/signIn"
  />
);

export default signup;
