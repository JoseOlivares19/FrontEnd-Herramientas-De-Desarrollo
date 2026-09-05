import useAuth from './useAuth';
import LogoutButton from './LogoutButton';

/**
 * Componente envolvente para rutas públicas/visitantes (US 04).
 * Si el usuario ya cuenta con un token en LocalStorage, le informa sobre su sesión activa
 * o redirige al panel privado para evitar autenticaciones redundantes.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Vista pública a renderizar si no está autenticado.
 * @param {Function} [props.onNavigateToDashboard] - Callback para navegar al panel si ya hay sesión.
 */
export default function PublicRoute({
  children,
  onNavigateToDashboard,
}) {
  const { isAuth, user } = useAuth();

  // Si no está autenticado, renderiza normalmente la vista pública (login/registro)
  if (!isAuth) {
    return <>{children}</>;
  }

  // Si ya tiene sesión activa y token en LocalStorage
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 bg-[#E2F2F3] font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-lg border border-slate-200 text-center space-y-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#E2F2F3] text-[#0D7C84] border border-[#0D7C84]/20 shadow-sm">
          <svg className="w-7 h-7 text-[#0D7C84]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-slate-800">
          Ya has iniciado sesión
        </h2>

        <p className="text-xs text-[#64748B]">
          Existe un token activo en LocalStorage para el propietario{' '}
          <strong className="text-[#0D7C84]">{user?.nombre || user?.email}</strong>.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
          {onNavigateToDashboard && (
            <button
              type="button"
              onClick={onNavigateToDashboard}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#0D7C84] hover:bg-[#0A646A] active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow transition cursor-pointer"
            >
              Ir a Mi Panel de Citas
            </button>
          )}

          <LogoutButton
            onRedirectToLogin={() => {}}
            label="Cerrar Sesión"
            className="w-full sm:w-auto py-2.5 px-3.5"
          />
        </div>
      </div>
    </div>
  );
}
