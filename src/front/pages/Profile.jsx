import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    console.log("→ token crudo:", token);
    if (!token || token === "null" || token.startsWith('"')) {
      console.error("Token inválido en sessionStorage");
      navigate("/login");
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await fetch("https://didactic-halibut-977qjrwr4x9fx65p-3001.app.github.dev/api/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("No se pudo obtener la información del usuario.");
        }

        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    };

    fetchUserInfo();
  }, [navigate]);

  if (!userInfo) {
    return <p>Cargando información del perfil...</p>;
  }

  return (
    <div className="container mt-5">
      <h2>Perfil del Usuario</h2>
      <ul className="list-group">
        <li className="list-group-item">
          <strong>ID de Usuario:</strong> {userInfo.user_id}
        </li>
        <li className="list-group-item">
          <strong>Rol:</strong> {userInfo.role}
        </li>
        <li className="list-group-item">
          <strong>Información Extra:</strong>{" "}
          {JSON.stringify(userInfo.info_extra)}
        </li>
      </ul>
    </div>
  );
};
