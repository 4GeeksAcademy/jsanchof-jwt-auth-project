import React, { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";

export const Home = () => {


	const { store, dispatch } = useGlobalReducer();
	const [ email, setEmail ] = useState("");
	const [ password, setPassword ] = useState("");
	const [ infoData, setInfoData ] = useState();
	const [ infoMe, setInfoMe ] = useState();

	const handleLogin = async () => {
		const data ={
			"email": email,
			"password": password
		}
		try {
			const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/login",{
				method: "POST",
				headers:{
					"content-Type": "application/json"
				},
				body: JSON.stringify(data)
			});

			if(!response.ok){
				throw new Error("there was an error while colling the /login endpoint")
			}

			const dataResponse = await response.json();
			sessionStorage.setItem("access_token", dataResponse.access_token)
			setInfoData(dataResponse)
		} catch (error) {
			console.error(error)
		}
	};


	const handleMe = async () => {
		try {
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/me`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
				}
			});
			const data = await response.json()
			setInfoMe(data)
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		
	}, [])

	return (
		<div className="text-center mt-5">
			<form>
				<div data-mdb-input-init className="form-outline mb-4">
					<input type="email" onChange={(e)=>{setEmail(e.target.value)}} id="form2Example1" className="form-control" />
					<label className="form-label" htmlFor="form2Example1">Email address</label>
				</div>
				<div data-mdb-input-init className="form-outline mb-4">
					<input type="password" onChange={(e)=>{setPassword(e.target.value)}} id="form2Example2" className="form-control" />
					<label className="form-label" htmlFor="form2Example2">Password</label>
				</div>jg,jg,ygjg
				<Link to="/demo">
					<button type="button" onClick={handleLogin}data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-block mb-4">Sign in</button>
				</Link>
				<button type="button" onClick={handleMe}data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-block mb-4">Show my info..</button>
			</form>


		</div>
	);
}; 