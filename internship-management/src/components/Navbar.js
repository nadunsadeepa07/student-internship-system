import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h2>SIMS</h2>
      <div>
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>
        <Link to="/testimonials">Testimonials</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;