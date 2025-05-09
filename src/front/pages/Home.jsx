import React, { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";

export const Home = () => {


	const { store, dispatch } = useGlobalReducer();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [infoData, setInfoData] = useState();
	const [infoMe, setInfoMe] = useState();

	const navigate = useNavigate();
	const handleCreateAccount = async () => {
		const data = { email, password};

		try {
			const response = await fetch("https://didactic-halibut-977qjrwr4x9fx65p-3001.app.github.dev/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data)
			});

			if (!response.ok) throw new Error("Error al registrar");

			const dataResponse = await response.json();
			sessionStorage.setItem("token", dataResponse.access_token);  // unifica con login

			dispatch({
				type: "login",
				payload: {
					token: dataResponse.access_token,
					role: "user"
				}
			});

			navigate("/login");  // redirige al perfil

		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {

	}, [])

	return (
		<div className="text-center mt-5">
			<div className="row justify-content-center">
				<h3>Create an account</h3>
				<form className="col-4">
					<div className="form-outline mb-4">
						<input type="email" onChange={(e) => setEmail(e.target.value)} className="form-control" />
						<label className="form-label">Email address</label>
					</div>
					<div className="form-outline mb-4">
						<input type="password" onChange={(e) => setPassword(e.target.value)} className="form-control" />
						<label className="form-label">Password</label>
					</div>
					<button type="button" onClick={handleCreateAccount} className="btn btn-primary btn-block mb-4">
						Create account
					</button>
				</form>

			</div>
		</div>
	);
}; 