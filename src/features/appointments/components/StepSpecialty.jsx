import { specialties } from '../data'

const specialtyIcons = {
  'Medicina General': '🩺',
  'Vacunacion': '💉',
  'Cirugia': '🏥',
  'Dermatologia': '🧴',
  'Odontologia': '🦷',
  'Cardiologia': '❤️',
  'Oftalmologia': '👁️',
}

export default function StepSpecialty({ selected, onSelect }) {
  return (
    <div className="step-content">
      <h3 className="step-title">Seleccione la especialidad</h3>
      <p className="step-description">Elija el tipo de atencion que necesita su mascota</p>
      <div className="specialty-grid">
        {specialties.map((spec) => (
          <button
            key={spec.id}
            className={`specialty-card ${selected === spec.id ? 'selected' : ''}`}
            onClick={() => onSelect(spec.id)}
          >
            <span className="specialty-icon">{specialtyIcons[spec.name] || '🏥'}</span>
            <span className="specialty-name">{spec.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
