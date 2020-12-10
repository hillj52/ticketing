import AuthForm from '../../containers/auth-form/auth-form';

const signup = () => (
  <AuthForm
    formLabel="Sign Up"
    submitLabel="Sign Up"
    useRequestURL="/api/users/signUp"
  />
);

export default signup;
