import NavBarBrand from '../nav-link/nav-bar-brand';
import NavLink from '../nav-link/nav-link';

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sell Tickets', href: '/tickets/new' },
    currentUser && { label: 'My Orders', href: '/orders' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => (
      <li key={href} className="nav-item">
        <NavLink href={href} label={label} />
      </li>
    ));

  return (
    <nav className="navbar navbar-light bg-light">
      <NavBarBrand />
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};

export default Header;
