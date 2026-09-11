import { pets } from '../data'

const speciesEmoji = {
  Perro: '🐕',
  Gato: '🐈',
  Ave: '🐦',
  Conejo: '🐇',
  Hamster: '🐹',
}

export default function StepPet({ selected, onSelect }) {
  return (
    <div className="step-content">
      <h3 className="step-title">Seleccione la mascota</h3>
      <p className="step-description">Elija la mascota para la consulta</p>
      <div className="pet-list">
        {pets.map((pet) => (
          <button
            key={pet.id}
            className={`pet-card ${selected === pet.id ? 'selected' : ''}`}
            onClick={() => onSelect(pet.id)}
          >
            <span className="pet-emoji">{speciesEmoji[pet.species] || '🐾'}</span>
            <div className="pet-info">
              <span className="pet-name">{pet.name}</span>
              <span className="pet-details">
                {pet.species} - {pet.breed}
              </span>
              <span className="pet-owner">Dueño: {pet.ownerName}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
