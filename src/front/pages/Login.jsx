import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { store, dispatch } = useGlobalReducer()

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            if (!email || !password) {
                alert("¡Todos los campos deben ser llenados!");
                return;
            }

            const cuenta = { email, password };

            const response = await fetch("https://didactic-halibut-977qjrwr4x9fx65p-3001.app.github.dev/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cuenta),
            });

            const data = await response.json();
            console.log(data)

            if (response.ok) {
                alert(data.msg || "¡Te has logeado con éxito!");

                
                sessionStorage.setItem("token", data.access_token);
                console.log("Token guardado en sessionStorage:", sessionStorage.getItem("token"));

                dispatch({
                    type: "login",
                    payload: {
                        token: data.access_token,
                        role: data.role,
                    }
                })
                if (data.role === "user") {
                    navigate("/profile")
                } else {
                    navigate("/")
                }

            } else {
                alert(data.msg || "Error al iniciar sesión.");
            }
        } catch (error) {
            console.log(error);
            alert("Hubo un error al procesar la solicitud.");
        }
    };
    return (
    <form className="row justify-content-center p-4" onSubmit={handleLogin}>
      <div className="col-md-6">
        <h1 className="text-center mb-5">Iniciar Sesión</h1>

        <div className="mb-5">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            id="inputEmail"
            style={{ borderRadius: "0" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-5">
          <input
            type="password"
            className="form-control"
            placeholder="Contraseña"
            id="inputPassword"
            style={{ borderRadius: "0" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary w-50">
            Iniciar Sesión
          </button>
        </div>
      </div>
    </form>
  );
};