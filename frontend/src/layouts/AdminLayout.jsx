import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h1 className="mb-4">Panel de Administración</h1>
        <Outlet />
      </div>
    </>
  );
}
