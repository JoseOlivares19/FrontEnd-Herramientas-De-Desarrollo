import { logoutUser } from './authService';

/**
 * Componente de botón para cerrar sesión (US 03).
 * Elimina el token de LocalStorage y ejecuta la redirección a la vista de login.
 * 
 * @param {Object} props
 * @param {Function} props.onRedirectToLogin - Callback para redirigir a login tras cerrar sesión.
 * @param {string} [props.className] - Clases CSS adicionales de Tailwind.
 * @param {boolean} [props.showConfirm] - Solicitar confirmación antes de salir.
 * @param {string} [props.label] - Texto del botón.
 */
export default function LogoutButton({
  onRedirectToLogin,
  className = '',
  showConfirm = false,
  label = 'Cerrar Sesión',
}) {
  const handleLogout = () => {
    if (showConfirm) {
      const confirmed = window.confirm('¿Estás seguro de que deseas cerrar sesión?');
      if (!confirmed) return;
    }

    // Ejecuta la eliminación del token y redirige
    logoutUser(() => {
      if (typeof onRedirectToLogin === 'function') {
        onRedirectToLogin();
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-red-700 bg-red-50 hover:bg-red-100 active:scale-[0.98] border border-red-200 transition duration-150 ease-in-out cursor-pointer shadow-sm ${className}`}
      title="Cerrar sesión y eliminar token"
    >
      <svg
        className="w-4 h-4 text-red-600 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      <span>{label}</span>
    </button>
  );
}

