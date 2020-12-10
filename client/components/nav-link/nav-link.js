import Link from 'next/link';

const NavLink = ({ label, href }) => (
  <Link href={href}>
    <a className="nav-link">{label}</a>
  </Link>
);

export default NavLink;
