import { Link } from "react-router-dom";

export const Navbar = () => {

	const handleLogOut = () =>{
		sessionStorage.removeItem("token")
	}

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					<Link to="/login">
						<button className="btn btn-danger" onClick={handleLogOut}>Logout</button>
					</Link>
				</div>
				<div className="ml-auto">
					<Link to="/login">
						<button className="btn btn-primary">Login</button>
					</Link>
				</div>
				
			</div>
		</nav>
	);
};