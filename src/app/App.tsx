import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import "./App.css";

export function App() {
  return (
    <div style={{ padding: 16 }}>
      <Nav />

      <h1>DeepDive Research</h1>

      <Outlet />
    </div>
  );
}
