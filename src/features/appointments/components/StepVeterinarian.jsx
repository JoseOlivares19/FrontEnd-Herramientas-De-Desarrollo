import { veterinarians } from '../data'

export default function StepVeterinarian({ selectedSpecialtyId, selected, onSelect }) {
  const filtered = veterinarians.filter((v) => v.specialtyId === selectedSpecialtyId)

  if (filtered.length === 0) {
    return (
      <div className="step-content">
        <h3 className="step-title">Seleccione el veterinario</h3>
        <p className="step-description empty-state">
          No hay veterinarios disponibles para esta especialidad
        </p>
      </div>
    )
  }

  return (
    <div className="step-content">
      <h3 className="step-title">Seleccione el veterinario</h3>
      <p className="step-description">Elija al profesional que atenderá a su mascota</p>
      <div className="vet-list">
        {filtered.map((vet) => (
          <button
            key={vet.id}
            className={`vet-card ${selected === vet.id ? 'selected' : ''}`}
            onClick={() => onSelect(vet.id)}
          >
            <div className="vet-avatar">
              {vet.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="vet-info">
              <span className="vet-name">{vet.name}</span>
              <span className="vet-schedule-hint">
                Lun-Vie | Sab: {vet.schedule.saturday?.length || 0} turnos
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
