// Barra lateral local para el panel del veterinario.

const NAV_ITEMS = [
  { label: "Dashboard", href: "#", activo: true },
  { label: "Pacientes", href: "#", activo: false },
  { label: "Citas", href: "#", activo: false },
  { label: "Inventario", href: "#", activo: false },
  { label: "Personal", href: "#", activo: false },
  { label: "Reportes", href: "#", activo: false },
];

export default function Sidebar() {
  return (
    <aside className="vet-sidebar">
      <div className="vet-sidebar__brand">
        <h1>VetCare</h1>
        <p>
          VetCare Admin
          <br />
          Gestión Integral
        </p>
      </div>

      <button className="vet-sidebar__nueva-cita">+ Nueva Cita</button>

      <nav className="vet-sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`vet-sidebar__link ${
              item.activo ? "vet-sidebar__link--activo" : ""
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <button className="vet-sidebar__logout">Cerrar Sesión</button>
    </aside>
  );
}
