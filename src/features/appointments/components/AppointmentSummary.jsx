export default function AppointmentSummary({ data, specialties, veterinarians, pets, onConfirm }) {
  const specialty = specialties.find((s) => s.id === data.specialtyId)
  const vet = veterinarians.find((v) => v.id === data.veterinarianId)
  const pet = pets.find((p) => p.id === data.petId)

  return (
    <div className="step-content summary">
      <h3 className="step-title">Resumen de la cita</h3>
      <p className="step-description">Revise los detalles antes de confirmar</p>

      <div className="summary-card">
        <div className="summary-row">
          <span className="summary-label">Especialidad</span>
          <span className="summary-value">{specialty?.name || '-'}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Veterinario</span>
          <span className="summary-value">{vet?.name || '-'}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Mascota</span>
          <span className="summary-value">{pet?.name ? `${pet.name} (${pet.species})` : '-'}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Fecha</span>
          <span className="summary-value">
            {data.date
              ? new Date(data.date + 'T00:00:00').toLocaleDateString('es-PE', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : '-'}
          </span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Hora</span>
          <span className="summary-value">{data.time || '-'}</span>
        </div>
      </div>

      <button className="btn-confirm" onClick={onConfirm}>
        Confirmar Cita
      </button>
    </div>
  )
}
