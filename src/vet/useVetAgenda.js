import { useEffect, useState } from "react";
import {
  getCitasHoy,
  marcarAtendida,
  marcarNoAtendida,
  reprogramarCita,
} from "./vetService";
 
const FILTROS = {
  todas: () => true,
  pendientes: (c) => c.estado === "pendiente",
  completadas: (c) => c.estado === "atendida" || c.estado === "no_atendida",
};
 
export function useVetAgenda() {
  const [citas, setCitas] = useState([]);
  const [filtro, setFiltro] = useState("todas");
  const [seleccionadaId, setSeleccionadaId] = useState(null);
 
  // US-18: cargar la agenda al iniciar.
  useEffect(() => {
    const datos = getCitasHoy();
    setCitas(datos);
    if (datos.length > 0) setSeleccionadaId(datos[0].id);
  }, []);
 
  const citasFiltradas = citas.filter(FILTROS[filtro]);
  const seleccionada = citas.find((c) => c.id === seleccionadaId) || null;
  const atendidasHoy = citas.filter((c) => c.estado === "atendida").length;
  const pendientesHoy = citas.filter((c) => c.estado === "pendiente").length;
 
  // US-19
  function seleccionarCita(id) {
    setSeleccionadaId(id);
  }
 
  // US-20
  function atenderCita(id) {
    setCitas(marcarAtendida(id));
  }
 
  // US-21
  function noAtenderCita(id) {
    setCitas(marcarNoAtendida(id));
  }
 
  function reprogramar(id) {
    setCitas(reprogramarCita(id));
  }
 
  return {
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
  };
}