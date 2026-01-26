import Header from "../components/Header/Header";
import { Outlet } from "react-router-dom";
import "./App.css";

export function App() {
  return (
    <div className="app-layout">
      <Header />
      <main className="page">
        <div className="inner-wrap">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
