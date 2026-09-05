import { getCurrentUser, getAuthToken, TOKEN_STORAGE_KEY } from './authService';
import LogoutButton from './LogoutButton';

export default function Dashboard({ onRedirectToLogin }) {
  const user = getCurrentUser();
  const token = getAuthToken();

  return (
    <div className="min-h-screen bg-[#E2F2F3] py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center font-sans">
      <div className="w-full max-w-2xl space-y-6">
        {/* Cabecera del Panel (Fondo blanco con bordes limpios) */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#0D7C84] text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
              {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'P'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-800">
                  {user?.nombre || 'Propietario de Mascota'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E2F2F3] text-[#0D7C84] border border-[#0D7C84]/20">
                  {user?.role || 'propietario'}
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">{user?.email}</p>
            </div>
          </div>

          {/* Botón de Cierre de Sesión (US 03) */}
          <div>
            <LogoutButton
              onRedirectToLogin={onRedirectToLogin}
              label="Cerrar Sesión y Salir"
              showConfirm={false}
              className="py-2.5 px-4 text-xs font-semibold"
            />
          </div>
        </div>

        {/* Tarjeta de Información de la Sesión y Token LocalStorage */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0D7C84] animate-pulse"></span>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Estado de la Autenticación (LocalStorage)
              </h2>
            </div>
            <span className="text-xs text-[#0D7C84] bg-[#E2F2F3] px-2.5 py-1 rounded-full font-bold border border-[#0D7C84]/30">
              Token Activo
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-1">
                Token temporal almacenado bajo clave (<code className="font-mono text-[#0D7C84]">{TOKEN_STORAGE_KEY}</code>):
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] font-mono text-slate-700 break-all select-all">
                {token || 'No hay token almacenado'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[#64748B] block text-[10px] uppercase font-bold">Teléfono</span>
                <span className="font-semibold text-slate-800">{user?.telefono || 'No registrado'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[#64748B] block text-[10px] uppercase font-bold">Dirección</span>
                <span className="font-semibold text-slate-800">{user?.direccion || 'No especificada'}</span>
              </div>
            </div>
          </div>

          {/* Explicación US 03 y US 04 */}
          <div className="mt-5 p-4 rounded-xl bg-[#E2F2F3] border border-[#0D7C84]/30 text-xs text-slate-700 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-[#0D7C84]">
              <svg className="w-4 h-4 text-[#0D7C84]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Seguridad &bull; Ruta Protegida Activa:
            </p>
            <p className="text-[#64748B] leading-relaxed">
              Esta vista está encapsulada dentro de <strong className="text-slate-800">&lt;ProtectedRoute&gt;</strong> (US 04), la cual comprobó que el token temporal existía en <code className="font-mono bg-white px-1 py-0.5 rounded text-[#0D7C84]">{TOKEN_STORAGE_KEY}</code> antes de renderizarla.
            </p>
          </div>
        </div>

        {/* Sección de Mascotas y Citas */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
          <h3 className="text-base font-bold text-slate-800 mb-3">
            Mascotas y Citas de Veterinaria
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
            <div className="p-5 border border-slate-200 rounded-xl bg-slate-50 hover:bg-[#E2F2F3]/40 transition">
              <span className="text-2xl block mb-1">🐾</span>
              <p className="text-xs font-bold text-slate-800">Mis Mascotas</p>
              <p className="text-[11px] text-[#64748B] mt-0.5">Registra tus caninos o felinos para consultas</p>
            </div>
            <div className="p-5 border border-slate-200 rounded-xl bg-slate-50 hover:bg-[#E2F2F3]/40 transition">
              <span className="text-2xl block mb-1">📅</span>
              <p className="text-xs font-bold text-slate-800">Agendar Cita Médica</p>
              <p className="text-[11px] text-[#64748B] mt-0.5">Selecciona veterinario y horario de atención</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
