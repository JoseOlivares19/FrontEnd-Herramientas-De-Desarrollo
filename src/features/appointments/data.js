const APPOINTMENTS_KEY = 'vet_appointments'

export const specialties = [
  { id: 1, name: 'Medicina General' },
  { id: 2, name: 'Vacunacion' },
  { id: 3, name: 'Cirugia' },
  { id: 4, name: 'Dermatologia' },
  { id: 5, name: 'Odontologia' },
  { id: 6, name: 'Cardiologia' },
  { id: 7, name: 'Oftalmologia' },
]

export const veterinarians = [
  {
    id: 1,
    name: 'Dr. Carlos Mendoza',
    specialtyId: 1,
    schedule: {
      monday: ['08:00','09:00','10:00','11:00','14:00','15:00','16:00'],
      tuesday: ['08:00','09:00','10:00','11:00','14:00','15:00','16:00'],
      wednesday: ['08:00','09:00','10:00','11:00','14:00','15:00','16:00'],
      thursday: ['08:00','09:00','10:00','11:00','14:00','15:00','16:00'],
      friday: ['08:00','09:00','10:00','11:00','14:00','15:00'],
      saturday: ['09:00','10:00','11:00'],
      sunday: [],
    },
  },
  {
    id: 2,
    name: 'Dra. Ana Garcia',
    specialtyId: 2,
    schedule: {
      monday: ['09:00','10:00','11:00','15:00','16:00'],
      tuesday: ['09:00','10:00','11:00','15:00','16:00'],
      wednesday: ['09:00','10:00','11:00','15:00','16:00'],
      thursday: ['09:00','10:00','11:00','15:00','16:00'],
      friday: ['09:00','10:00','11:00'],
      saturday: ['10:00','11:00'],
      sunday: [],
    },
  },
  {
    id: 3,
    name: 'Dr. Luis Torres',
    specialtyId: 3,
    schedule: {
      monday: ['08:00','10:00','14:00','16:00'],
      tuesday: ['08:00','10:00','14:00','16:00'],
      wednesday: ['08:00','10:00','14:00'],
      thursday: ['08:00','10:00','14:00','16:00'],
      friday: ['08:00','10:00'],
      saturday: [],
      sunday: [],
    },
  },
  {
    id: 4,
    name: 'Dra. Maria Lopez',
    specialtyId: 4,
    schedule: {
      monday: ['09:00','10:00','11:00','14:00','15:00','16:00'],
      tuesday: ['09:00','10:00','11:00','14:00','15:00','16:00'],
      wednesday: ['09:00','10:00','11:00'],
      thursday: ['09:00','10:00','11:00','14:00','15:00','16:00'],
      friday: ['09:00','10:00','11:00','14:00','15:00'],
      saturday: ['09:00','10:00'],
      sunday: [],
    },
  },
  {
    id: 5,
    name: 'Dr. Roberto Sanchez',
    specialtyId: 5,
    schedule: {
      monday: ['08:00','09:00','10:00','11:00'],
      tuesday: ['08:00','09:00','10:00','11:00'],
      wednesday: ['08:00','09:00','10:00','11:00','14:00','15:00','16:00'],
      thursday: ['08:00','09:00','10:00','11:00'],
      friday: ['08:00','09:00','10:00','11:00'],
      saturday: [],
      sunday: [],
    },
  },
]

export const pets = [
  { id: 1, name: 'Max', species: 'Perro', breed: 'Labrador', ownerName: 'Juan Perez' },
  { id: 2, name: 'Luna', species: 'Gato', breed: 'Siames', ownerName: 'Juan Perez' },
  { id: 3, name: 'Rocky', species: 'Perro', breed: 'Pastor Aleman', ownerName: 'Maria Garcia' },
  { id: 4, name: 'Mimi', species: 'Gato', breed: 'Persa', ownerName: 'Maria Garcia' },
  { id: 5, name: 'Tweety', species: 'Ave', breed: 'Canario', ownerName: 'Carlos Lopez' },
]

function getStoredAppointments() {
  const data = localStorage.getItem(APPOINTMENTS_KEY)
  return data ? JSON.parse(data) : []
}

function saveAppointments(appointments) {
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments))
}

export function getAppointments() {
  return getStoredAppointments()
}

export function getAppointmentById(id) {
  return getStoredAppointments().find((a) => a.id === id) || null
}

export function createAppointment(appointmentData) {
  const appointments = getStoredAppointments()
  const newId = appointments.length > 0 ? Math.max(...appointments.map((a) => a.id)) + 1 : 1
  const newAppointment = {
    id: newId,
    ...appointmentData,
    status: 'programada',
    createdAt: new Date().toISOString(),
  }
  appointments.push(newAppointment)
  saveAppointments(appointments)
  return newAppointment
}

export function updateAppointment(id, updates) {
  const appointments = getStoredAppointments()
  const index = appointments.findIndex((a) => a.id === id)
  if (index === -1) return null
  appointments[index] = { ...appointments[index], ...updates, updatedAt: new Date().toISOString() }
  saveAppointments(appointments)
  return appointments[index]
}

export function cancelAppointment(id) {
  return updateAppointment(id, { status: 'cancelada' })
}

export function getAppointmentsByVetAndDate(vetId, date) {
  return getStoredAppointments().filter(
    (a) => a.veterinarianId === vetId && a.date === date && a.status !== 'cancelada'
  )
}
