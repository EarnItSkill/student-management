import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { AppProvider } from "./context/AppContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
