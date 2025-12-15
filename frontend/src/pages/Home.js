import { useNavigate } from "react-router-dom";
import homeImage from "../assets/inicio.png";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* HERO */}
      <section
        style={{
          minHeight: "100vh",
          backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${homeImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="d-flex align-items-center"
      >
        <div className="container text-white">
          <h1 className="display-3 fw-bold">Kilómetro Uno</h1>
          <p className="lead mt-3">
            Entrena mejor. <br />
            No más fuerte.
          </p>

          <div className="mt-4 d-flex gap-3">
            <button
              className="btn btn-danger btn-lg"
              onClick={() => navigate("/login")}
            >
              Entrar
            </button>
            <a href="#metodo" className="btn btn-outline-light btn-lg">
              Conocer el método
            </a>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="container my-5 text-center">
        <h2 className="fw-bold mb-4">¿Te suena?</h2>

        <p className="fs-5">
          Entrenas. Te esfuerzas. Sigues vídeos y planes…
        </p>

        <p className="fs-5">
          <strong>Y aun así:</strong>
        </p>

        <ul className="list-unstyled fs-5">
          <li>❌ Mismos ritmos</li>
          <li>❌ Mismas lesiones</li>
          <li>❌ Misma frustración</li>
        </ul>

        <p className="mt-4 text-muted">
          No te pasa nada raro. Te pasa lo que al 90% de corredores que entrenan
          sin dirección.
        </p>
      </section>

      {/* FRASE CLAVE */}
      <section className="bg-dark text-white py-5 text-center">
        <div className="container">
          <h2 className="display-6 fw-bold">
            Correr más no te hace mejor.
            <br />
            <span className="text-danger">Correr mejor sí.</span>
          </h2>

          <p className="mt-3 text-muted">
            Pero solo ocurre cuando entrenas con estructura y propósito.
          </p>
        </div>
      </section>

      {/* COACH */}
      <section className="container my-5">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h3 className="fw-bold">¿Quién es Pablo Cristóbal?</h3>

            <p className="mt-3">
              Entrenador de corredores y atleta de medio fondo. Graduado en
              Ciencias de la Actividad Física y el Deporte y especializado en
              deportes de resistencia y alto rendimiento.
            </p>

            <p>
              Kilómetro Uno nace tras años de formación y experiencia ayudando a
              corredores reales a mejorar su rendimiento y reducir lesiones.
            </p>

            <a
              href="https://www.instagram.com/pablo_cristobal/"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-dark mt-3"
            >
              Ver Instagram del coach
            </a>
          </div>
        </div>
      </section>

      {/* VIDEO INSTAGRAM */}
      <section className="bg-light py-5">
        <div className="container text-center">
          <h3 className="fw-bold mb-4">
            Esto no va de entrenar más.
            <br />
            Va de entrenar mejor.
          </h3>

          <div className="d-flex justify-content-center">
            <iframe
              src="https://www.instagram.com/reel/DQuXARoAnas/embed"
              width="320"
              height="570"
              frameBorder="0"
              allowFullScreen
              title="Instagram Reel"
            ></iframe>
          </div>
        </div>
      </section>

      {/* METODO */}
      <section id="metodo" className="container my-5">
        <h3 className="fw-bold text-center mb-4">
          ¿Cómo funciona Kilómetro Uno?
        </h3>

        <div className="row text-center">
          <div className="col-md-4">
            <h5>🟢 Te escuchamos</h5>
            <p>Conocemos tu historia, nivel y objetivos.</p>
          </div>

          <div className="col-md-4">
            <h5>🟢 Te guiamos</h5>
            <p>Plan personalizado y feedback continuo.</p>
          </div>

          <div className="col-md-4">
            <h5>🟢 Progresas</h5>
            <p>Menos lesiones, mejores marcas.</p>
          </div>
        </div>
      </section>

      {/* RESULTADOS */}
      <section className="bg-dark text-white py-5 text-center">
        <div className="container">
          <h3 className="fw-bold">
            Más de 100 corredores han pasado por Kilómetro Uno
          </h3>
          <p className="mt-2 text-muted">
            Más del 90% ha mejorado marcas o reducido lesiones
          </p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="container my-5 text-center">
        <h2 className="fw-bold">
          Dentro de seis meses puedes seguir igual…
          <br />
          o estar entrenando con propósito.
        </h2>

        <button
          className="btn btn-danger btn-lg mt-4"
          onClick={() => navigate("/login")}
        >
          Entrar a Kilómetro Uno
        </button>

        <p className="mt-3 text-muted">
          No es para todos. Solo para quienes quieren dejar de improvisar.
        </p>
      </section>
    </>
  );
}
