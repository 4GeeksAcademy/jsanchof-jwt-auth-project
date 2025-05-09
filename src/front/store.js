export const initialStore = () => ({
  isAuthenticated: false,
  token: null,
  role: null,
});

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "login":
      return {
        ...store,
        isAuthenticated: true,
        token: action.payload.token,
        role: action.payload.role,
      };

    case "logout":
      return {
        ...store,
        isAuthenticated: false,
        token: null,
        role: null,
      };

    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}
