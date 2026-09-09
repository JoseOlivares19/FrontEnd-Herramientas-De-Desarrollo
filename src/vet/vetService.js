//Capa de datos del módulo veterinario

const STORAGE_KEY = "vetcare_citas_veterinario";
 
const CITAS_INICIALES = [
  {
    id: "cita-001",
    hora: "08:00 AM",
    mascota: { nombre: "Bella", especie: "Perro", raza: "Golden Retriever" },
    propietario: { nombre: "Juan Pérez", telefono: "555-0101" },
    motivo: "Vacunación Anual",
    urgente: false,
    estado: "atendida",
    ultimasVisitas: [
      { tipo: "Desparasitación", fecha: "12 Sep 2023", doctor: "Dra. Ruiz" },
    ],
  },
  {
    id: "cita-002",
    hora: "09:30 AM",
    mascota: { nombre: "Milo", especie: "Gato", raza: "Siamés" },
    propietario: { nombre: "Ana Gómez", telefono: "555-0192" },
    motivo:
      "Control post-operatorio (Esterilización realizada hace 7 días). Propietaria reporta leve inflamación en la zona de incisión.",
    urgente: true,
    estado: "pendiente",
    ultimasVisitas: [
      { tipo: "Esterilización", fecha: "17 Oct 2023", doctor: "Dr. Martínez" },
      { tipo: "Vacunación Triple Felina", fecha: "10 May 2023", doctor: "Dra. Silva" },
    ],
  },
  {
    id: "cita-003",
    hora: "10:15 AM",
    mascota: { nombre: "Toby", especie: "Perro", raza: "Beagle" },
    propietario: { nombre: "Lucía Fernández", telefono: "555-0233" },
    motivo: "Chequeo general y desparasitación",
    urgente: false,
    estado: "no_atendida",
    ultimasVisitas: [
      { tipo: "Vacunación Anual", fecha: "02 Mar 2023", doctor: "Dr. Martínez" },
    ],
  },
  {
    id: "cita-004",
    hora: "11:00 AM",
    mascota: { nombre: "Rocky", especie: "Perro", raza: "Bulldog" },
    propietario: { nombre: "Carlos Ruiz", telefono: "555-0143" },
    motivo: "Dermatología",
    urgente: false,
    estado: "pendiente",
    ultimasVisitas: [],
  },
  {
    id: "cita-005",
    hora: "12:30 PM",
    mascota: { nombre: "Nina", especie: "Gato", raza: "Persa" },
    propietario: { nombre: "Diego Salas", telefono: "555-0288" },
    motivo: "Control de peso y alimentación",
    urgente: false,
    estado: "atendida",
    ultimasVisitas: [
      { tipo: "Baño medicado", fecha: "20 Jul 2023", doctor: "Dra. Ruiz" },
    ],
  },
  {
    id: "cita-006",
    hora: "02:00 PM",
    mascota: { nombre: "Simba", especie: "Perro", raza: "Labrador" },
    propietario: { nombre: "Valeria Torres", telefono: "555-0310" },
    motivo: "Urgencia: cojea de la pata trasera derecha",
    urgente: true,
    estado: "pendiente",
    ultimasVisitas: [],
  },
];
 
function leerStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(CITAS_INICIALES));
    return CITAS_INICIALES;
  }
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(CITAS_INICIALES));
    return CITAS_INICIALES;
  }
}
 
function guardarStorage(citas) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(citas));
}
 
/** US-18 */
export function getCitasHoy() {
  return leerStorage();
}
 
/** US-19 */
export function getCitaPorId(id) {
  return leerStorage().find((c) => c.id === id) || null;
}
 
/** US-20 */
export function marcarAtendida(id) {
  const citas = leerStorage().map((c) =>
    c.id === id ? { ...c, estado: "atendida" } : c
  );
  guardarStorage(citas);
  return citas;
}
 
/** US-21 */
export function marcarNoAtendida(id) {
  const citas = leerStorage().map((c) =>
    c.id === id ? { ...c, estado: "no_atendida" } : c
  );
  guardarStorage(citas);
  return citas;
}
 
export function reprogramarCita(id) {
  const citas = leerStorage().map((c) =>
    c.id === id ? { ...c, estado: "pendiente" } : c
  );
  guardarStorage(citas);
  return citas;
}