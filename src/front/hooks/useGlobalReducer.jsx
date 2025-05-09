import { useContext, useReducer, createContext } from "react";
import storeReducer, { initialStore } from "../store";

// Crear el contexto global
const StoreContext = createContext();

// Proveedor del store global
export function StoreProvider({ children }) {
  const [store, dispatch] = useReducer(storeReducer, initialStore());

  return (
    <StoreContext.Provider value={{ store, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

// Hook personalizado para consumir el contexto
export default function useGlobalReducer() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useGlobalReducer debe usarse dentro de StoreProvider");
  }
  return context;
}
