import Navbar from "../components/Navbar";

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Bienvenido a Kilómetro 1 🏃‍♂️</h2>
        <p className="text-muted">
          Aquí verás carreras, logros y vídeos del grupo.
        </p>

        <div className="row mt-4">
          <div className="col-md-4">
            <div className="card p-3 shadow-sm">
              <h5>Carreras</h5>
              <p>En preparacion</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-3 shadow-sm">
              <h5>Logros</h5>
              <p>En preparacion</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-3 shadow-sm">
              <h5>Vídeos</h5>
              <p>En preparacion</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
