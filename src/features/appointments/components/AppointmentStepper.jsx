import { useState } from 'react'
import StepSpecialty from './StepSpecialty'
import StepVeterinarian from './StepVeterinarian'
import StepPet from './StepPet'
import StepDateTime from './StepDateTime'
import AppointmentSummary from './AppointmentSummary'
import { specialties, veterinarians, pets, createAppointment } from '../data'
import '../styles/appointments.css'

const STEPS = [
  { id: 1, label: 'Especialidad' },
  { id: 2, label: 'Veterinario' },
  { id: 3, label: 'Mascota' },
  { id: 4, label: 'Fecha y Hora' },
  { id: 5, label: 'Confirmar' },
]

export default function AppointmentStepper() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    specialtyId: null,
    veterinarianId: null,
    petId: null,
    date: null,
    time: null,
  })
  const [success, setSuccess] = useState(false)

  const canGoNext = () => {
    switch (currentStep) {
      case 1: return formData.specialtyId !== null
      case 2: return formData.veterinarianId !== null
      case 3: return formData.petId !== null
      case 4: return formData.date !== null && formData.time !== null
      default: return false
    }
  }

  const goNext = () => {
    if (currentStep < STEPS.length && canGoNext()) {
      setCurrentStep((s) => s + 1)
    }
  }

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1)
    }
  }

  const handleConfirm = () => {
    createAppointment({
      specialtyId: formData.specialtyId,
      veterinarianId: formData.veterinarianId,
      petId: formData.petId,
      date: formData.date,
      time: formData.time,
    })
    setSuccess(true)
  }

  const handleReset = () => {
    setCurrentStep(1)
    setFormData({ specialtyId: null, veterinarianId: null, petId: null, date: null, time: null })
    setSuccess(false)
  }

  if (success) {
    return (
      <div className="stepper-container">
        <div className="success-message">
          <div className="success-icon">&#10003;</div>
          <h3>Cita agendada exitosamente</h3>
          <p>Su cita ha sido registrada correctamente.</p>
          <button className="btn-primary" onClick={handleReset}>
            Agendar otra cita
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="stepper-container">
      <div className="stepper-header">
        <h2 className="stepper-main-title">Agendar Cita</h2>
        <div className="stepper-progress">
          {STEPS.map((step, index) => (
            <div key={step.id} className={`stepper-step ${currentStep >= step.id ? 'active' : ''} ${currentStep === step.id ? 'current' : ''}`}>
              <div className="step-circle">
                {currentStep > step.id ? '✓' : step.id}
              </div>
              <span className="step-label">{step.label}</span>
              {index < STEPS.length - 1 && <div className="step-connector" />}
            </div>
          ))}
        </div>
      </div>

      <div className="stepper-body">
        {currentStep === 1 && (
          <StepSpecialty
            selected={formData.specialtyId}
            onSelect={(id) => setFormData({ ...formData, specialtyId: id, veterinarianId: null })}
          />
        )}
        {currentStep === 2 && (
          <StepVeterinarian
            selectedSpecialtyId={formData.specialtyId}
            selected={formData.veterinarianId}
            onSelect={(id) => setFormData({ ...formData, veterinarianId: id })}
          />
        )}
        {currentStep === 3 && (
          <StepPet
            selected={formData.petId}
            onSelect={(id) => setFormData({ ...formData, petId: id })}
          />
        )}
        {currentStep === 4 && (
          <StepDateTime
            selectedVetId={formData.veterinarianId}
            selectedDate={formData.date}
            selectedTime={formData.time}
            onSelectDate={(date) => setFormData({ ...formData, date })}
            onSelectTime={(time) => setFormData({ ...formData, time })}
          />
        )}
        {currentStep === 5 && (
          <AppointmentSummary
            data={formData}
            specialties={specialties}
            veterinarians={veterinarians}
            pets={pets}
            onConfirm={handleConfirm}
          />
        )}
      </div>

      <div className="stepper-footer">
        <button className="btn-secondary" onClick={goBack} disabled={currentStep === 1}>
          Anterior
        </button>
        {currentStep < STEPS.length && (
          <button className="btn-primary" onClick={goNext} disabled={!canGoNext()}>
            Siguiente
          </button>
        )}
      </div>
    </div>
  )
}
