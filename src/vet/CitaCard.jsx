// Componente de presentación: una fila de la lista de la agenda diaria (US-18).

const ESTADO_LABEL = {
  atendida: { texto: "Atendida", clase: "badge-ok" },
  no_atendida: { texto: "No Asistió", clase: "badge-danger" },
  pendiente: { texto: "Pendiente", clase: "badge-pending" },
};

export default function CitaCard({ cita, activa, onSeleccionar }) {
  const estado = ESTADO_LABEL[cita.estado];

  return (
    <li
      className={`cita-card ${activa ? "cita-card--activa" : ""}`}
      onClick={() => onSeleccionar(cita.id)} // US-19: selección para ver detalle
    >
      <div className="cita-card__hora">
        {cita.hora.split(" ")[0]}
        <span>{cita.hora.split(" ")[1]}</span>
      </div>
      <div className="cita-card__info">
        <div className="cita-card__titulo">
          <strong>{cita.mascota.nombre}</strong>
          <span className="tag">
            {cita.mascota.especie} - {cita.mascota.raza}
          </span>
          {cita.urgente && <span className="tag tag--urgente">Urgencia</span>}
        </div>
        <div className="cita-card__meta">
          {cita.propietario.nombre} · {cita.motivo}
        </div>
      </div>
      <span className={`badge ${estado.clase}`}>{estado.texto}</span>
    </li>
  );
}
