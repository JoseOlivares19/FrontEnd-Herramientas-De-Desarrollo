import { useEffect } from 'react';
import useAuth from './useAuth';
import { TOKEN_STORAGE_KEY } from './authService';

/**
 * Componente envolvente para proteger rutas (US 04).
 * Verifica si existe el token en LocalStorage antes de renderizar la vista protegida.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente o vista protegida a renderizar.
 * @param {Function} [props.onUnauthorized] - Callback que se ejecuta cuando no hay token en LocalStorage.
 * @param {React.ReactNode} [props.fallback] - Vista alternativa opcional en caso de no estar autenticado.
 * @param {boolean} [props.autoRedirect=false] - Si es true, redirige automáticamente a login sin mostrar la pantalla de bloqueo.
 */
export default function ProtectedRoute({
  children,
  onUnauthorized,
  fallback,
  autoRedirect = false,
}) {
  const { isAuth, token } = useAuth();

  useEffect(() => {
    if (!isAuth && autoRedirect && typeof onUnauthorized === 'function') {
      onUnauthorized();
    }
  }, [isAuth, autoRedirect, onUnauthorized]);

  // Si existe el token en LocalStorage, permite el renderizado de la vista protegida
  if (isAuth && token) {
    return <>{children}</>;
  }

  // Si se proporcionó una vista fallback personalizada, se renderiza
  if (fallback) {
    return <>{fallback}</>;
  }

  // Vista de bloqueo por defecto: Pantalla de Acceso Denegado
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-slate-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-2xl p-6 sm:p-8 shadow-xl border border-red-100 text-center">
        {/* Icono de candado / ruta bloqueada */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100 text-red-600 mb-4 shadow-inner">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          Acceso Restringido
        </h2>
        <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mt-1">
          Ruta Protegida &bull; US 04
        </p>

        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
          Esta vista está protegida y requiere autenticación previa. No se encontró ningún token temporal válido en{' '}
          <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-xs text-red-700">
            localStorage.getItem(&apos;{TOKEN_STORAGE_KEY}&apos;)
          </code>.
        </p>

        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-2.5">
          {onUnauthorized && (
            <button
              type="button"
              onClick={onUnauthorized}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
            >
              Ir al Inicio de Sesión
            </button>
          )}

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-left text-[11px] text-amber-800 space-y-0.5">
            <p className="font-bold flex items-center gap-1">
              <span>🛡️</span> Validación del Envolvente:
            </p>
            <p>
              El componente envolvente interceptó la navegación antes de montar la vista privada para proteger los datos médicos y de citas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

