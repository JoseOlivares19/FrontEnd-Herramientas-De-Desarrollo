// Panel de detalle de la cita seleccionada.
// US-19: mostrar el detalle. US-20/US-21: acciones sobre el estado de la cita.

export default function CitaDetailPanel({
  cita,
  onAtender,
  onNoAsistio,
  onReprogramar,
}) {
  if (!cita) {
    return (
      <aside className="vet-detalle">
        <p className="vet-detalle__vacio">
          Selecciona una cita para ver el detalle.
        </p>
      </aside>
    );
  }

  return (
    <aside className="vet-detalle">
      <div className="vet-detalle__mascota">
        <div className="vet-detalle__avatar">
          {cita.mascota.nombre.charAt(0)}
        </div>
        <div>
          <h2>{cita.mascota.nombre}</h2>
          <p>
            {cita.mascota.especie} · {cita.mascota.raza}
          </p>
        </div>
      </div>

      <div className="vet-detalle__grid">
        <div>
          <span className="label">Propietario</span>
          <p>{cita.propietario.nombre}</p>
        </div>
        <div>
          <span className="label">Contacto</span>
          <p>{cita.propietario.telefono}</p>
        </div>
      </div>

      <div className="vet-detalle__motivo">
        <span className="label">Motivo de Consulta</span>
        <p>{cita.motivo}</p>
      </div>

      {cita.ultimasVisitas.length > 0 && (
        <div className="vet-detalle__visitas">
          <span className="label">Últimas Visitas</span>
          <ul>
            {cita.ultimasVisitas.map((v, i) => (
              <li key={i}>
                <strong>{v.tipo}</strong>
                <span>
                  {v.fecha} - {v.doctor}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* US-20 / US-21 */}
      <div className="vet-detalle__acciones">
        <button
          className="btn btn--primary"
          onClick={() => onAtender(cita.id)}
          disabled={cita.estado === "atendida"}
        >
          Marcar Atendida
        </button>
        <div className="vet-detalle__acciones-secundarias">
          <button className="btn btn--outline" onClick={() => onNoAsistio(cita.id)}>
            No Asistió
          </button>
          <button className="btn btn--outline" onClick={() => onReprogramar(cita.id)}>
            Reprogramar
          </button>
        </div>
      </div>
    </aside>
  );
}
