// Componente contenedor: arma la pantalla usando el hook useVetAgenda
// y los componentes CitaCard / CitaDetailPanel.
import { useVetAgenda } from "./useVetAgenda";
import CitaCard from "./CitaCard";
import CitaDetailPanel from "./CitaDetailPanel";
import "./VetDashboard.css";

const NOMBRES_FILTRO = ["todas", "pendientes", "completadas"];

export default function VetDashboard() {
  const {
    citas,
    citasFiltradas,
    filtro,
    setFiltro,
    seleccionada,
    seleccionarCita,
    atendidasHoy,
    pendientesHoy,
    atenderCita,
    noAtenderCita,
    reprogramar,
  } = useVetAgenda();

  const hoy = new Date().toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "long",
  });

  return (
    <div className="vet-dashboard">
      <header className="vet-dashboard__header">
        <div>
          <h1>Mi Agenda Diaria</h1>
          <p className="vet-dashboard__subtitle">
            Hoy, {hoy} · {citas.length} citas programadas
          </p>
        </div>
        <div className="vet-dashboard__stats">
          <div className="stat-pill stat-pill--ok">
            <span className="stat-pill__label">Atendidas</span>
            <span className="stat-pill__value">{atendidasHoy}</span>
          </div>
          <div className="stat-pill stat-pill--pending">
            <span className="stat-pill__label">Pendientes</span>
            <span className="stat-pill__value">{pendientesHoy}</span>
          </div>
        </div>
      </header>

      <div className="vet-dashboard__body">
        <section className="vet-agenda">
          <div className="vet-agenda__tabs">
            {NOMBRES_FILTRO.map((clave) => (
              <button
                key={clave}
                className={`tab ${filtro === clave ? "tab--active" : ""}`}
                onClick={() => setFiltro(clave)}
              >
                {clave.charAt(0).toUpperCase() + clave.slice(1)}
              </button>
            ))}
          </div>

          <ul className="vet-agenda__lista">
            {citasFiltradas.length === 0 && (
              <li className="vet-agenda__vacio">
                No hay citas en esta categoría.
              </li>
            )}
            {citasFiltradas.map((cita) => (
              <CitaCard
                key={cita.id}
                cita={cita}
                activa={seleccionada?.id === cita.id}
                onSeleccionar={seleccionarCita}
              />
            ))}
          </ul>
        </section>

        <CitaDetailPanel
          cita={seleccionada}
          onAtender={atenderCita}
          onNoAsistio={noAtenderCita}
          onReprogramar={reprogramar}
        />
      </div>
    </div>
  );
}
