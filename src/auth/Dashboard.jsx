import { getCurrentUser, getAuthToken, TOKEN_STORAGE_KEY } from './authService';
import LogoutButton from './LogoutButton';

export default function Dashboard({ onRedirectToLogin }) {
  const user = getCurrentUser();
  const token = getAuthToken();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        {/* Cabecera del Panel */}
        <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-md border border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow">
              {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'P'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-800">
                  {user?.nombre || 'Propietario de Mascota'}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                  {user?.role || 'propietario'}
                </span>
              </div>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>

          {/* Botón de Cierre de Sesión (US 03) */}
          <div>
            <LogoutButton
              onRedirectToLogin={onRedirectToLogin}
              label="Cerrar Sesión y Salir"
              showConfirm={false}
              className="py-2.5 px-4 text-xs font-bold"
            />
          </div>
        </div>

        {/* Tarjeta de Información de la Sesión y Token LocalStorage */}
        <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-md border border-slate-200">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Estado de la Autenticación (LocalStorage)
              </h2>
            </div>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
              Token Activo
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-1">
                Token temporal almacenado bajo clave (<code className="font-mono text-emerald-700">{TOKEN_STORAGE_KEY}</code>):
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] font-mono text-slate-700 break-all select-all">
                {token || 'No hay token almacenado'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Teléfono</span>
                <span className="font-semibold text-slate-700">{user?.telefono || 'No registrado'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Dirección</span>
                <span className="font-semibold text-slate-700">{user?.direccion || 'No especificada'}</span>
              </div>
            </div>
          </div>

          {/* Explicación US 03 */}
          <div className="mt-5 p-4 rounded-xl bg-cyan-50 border border-cyan-200 text-xs text-cyan-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-cyan-800">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Historia de Usuario 03 (US 03):
            </p>
            <p>
              Al presionar el botón <strong>&quot;Cerrar Sesión&quot;</strong>, se invoca <code className="font-mono bg-cyan-100 px-1 py-0.5 rounded text-cyan-800">logoutUser()</code>, que elimina automáticamente la clave <code className="font-mono bg-cyan-100 px-1 py-0.5 rounded text-cyan-800">{TOKEN_STORAGE_KEY}</code> y los datos de sesión de <code className="font-mono bg-cyan-100 px-1 py-0.5 rounded text-cyan-800">LocalStorage</code>, redirigiendo de inmediato a la vista de login.
            </p>
          </div>
        </div>

        {/* Sección de Citas Médicas Veterinarias (Contexto de la App) */}
        <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-md border border-slate-200">
          <h3 className="text-base font-bold text-slate-800 mb-3">
            Mascotas y Citas de Veterinaria
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
            <div className="p-5 border-2 border-dashed border-emerald-200 rounded-xl bg-emerald-50/30">
              <span className="text-2xl block mb-1">🐾</span>
              <p className="text-xs font-bold text-slate-700">Mis Mascotas</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Registra tus caninos o felinos para consultas</p>
            </div>
            <div className="p-5 border-2 border-dashed border-teal-200 rounded-xl bg-teal-50/30">
              <span className="text-2xl block mb-1">📅</span>
              <p className="text-xs font-bold text-slate-700">Agendar Cita Médica</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Selecciona veterinario y horario de atención</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

