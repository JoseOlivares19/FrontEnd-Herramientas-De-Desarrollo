import { useState } from 'react';
import vetHeroImg from './assets/vet-hero.png';
import {
  loginUser,
  getAuthToken,
  getCurrentUser,
  getRegisteredUsers,
  logoutUser,
  TOKEN_STORAGE_KEY,
} from './authService';

export default function Login({ onNavigateToRegister, onLoginSuccess, logoutNotice = '' }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [notice, setNotice] = useState(logoutNotice);
  const [showTestAccounts, setShowTestAccounts] = useState(false);
  const [session, setSession] = useState(() => ({
    user: getCurrentUser(),
    token: getAuthToken(),
  }));

  const registeredUsers = getRegisteredUsers();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email.trim() || !formData.password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    const result = loginUser({
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      setSuccess(`¡Bienvenido de nuevo, ${result.user.nombre}!`);
      setSession({
        user: result.user,
        token: result.token,
      });
      setFormData({ email: '', password: '' });

      if (onLoginSuccess) {
        onLoginSuccess(result.user, result.token);
      }
    } else {
      setError(result.error);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setSession({ user: null, token: null });
    setSuccess('');
    setError('');
    setNotice('Sesión cerrada correctamente. El token temporal fue eliminado de LocalStorage.');
  };

  const handleQuickFill = (user) => {
    setFormData({
      email: user.email,
      password: user.password,
    });
    setError('');
  };

  return (
    <div className="w-full max-w-5xl my-auto font-sans">
      {/* Tarjeta Contenedora Principal Split-Screen (Dimensiones y Estructura Unificada) */}
      <div className="w-full bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-2 lg:min-h-[520px]">
        
        {/* Panel Lateral Izquierdo: Hero con Imagen Superpuesta (Login) */}
        <div className="relative min-h-[260px] sm:min-h-[300px] lg:min-h-[520px] flex flex-col justify-between p-6 sm:p-8 lg:p-9 overflow-hidden bg-slate-900 order-1">
          {/* Imagen importada desde ./assets/vet-hero.png */}
          <img
            src={vetHeroImg}
            alt="Veterinaria VetCare con mascota"
            className="absolute inset-0 w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 opacity-80"
          />

          {/* Capa de degradado con tono Primary (#0D7C84) para máxima legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D7C84]/95 via-[#0D7C84]/65 to-slate-900/40" />

          {/* Contenido Superpuesto Superior */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold shadow-sm">
              <span>🐾</span>
              <span>Atención Médica Veterinaria 24/7</span>
            </div>
          </div>

          {/* Contenido Superpuesto Inferior: Título y Texto */}
          <div className="relative z-10 space-y-2 sm:space-y-2.5">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight tracking-tight drop-shadow-sm">
              Cuidado experto y amor para tus mejores amigos
            </h2>
            <p className="text-xs sm:text-sm text-slate-100/95 leading-relaxed max-w-md">
              Accede a tu cuenta de propietario para gestionar citas médicas, historiales clínicos y asegurar la mejor atención médica para tus compañeros.
            </p>

            <div className="pt-2.5 border-t border-white/20 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs text-white/95 font-medium">
              <span>✓ Citas en línea</span>
              <span>✓ Especialistas</span>
              <span>✓ Historial médico</span>
            </div>
          </div>
        </div>

        {/* Panel Lateral Derecho: Formulario de Autenticación VetCare */}
        <div className="p-5 sm:p-7 lg:p-8 flex flex-col justify-center bg-white order-2">
          {/* Logotipo y Nombre "VetCare" */}
          <div className="mb-2 sm:mb-2.5 flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#0D7C84] text-white flex items-center justify-center shadow-sm flex-shrink-0">
              <svg
                className="w-5 h-5 sm:w-5 sm:h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-1 leading-none">
                Vet<span className="text-[#0D7C84]">Care</span>
              </span>
              <p className="text-[10px] sm:text-[11px] font-semibold text-[#0D7C84] mt-0.5">
                Clínica Veterinaria &bull; Portal de Propietarios (US 02)
              </p>
            </div>
          </div>

          {/* Título y subtítulo */}
          <div className="mb-2.5 sm:mb-3">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight leading-snug">
              Iniciar Sesión
            </h3>
            <p className="text-xs text-[#64748B]">
              Ingresa tus credenciales para acceder a tus citas.
            </p>
          </div>

          {/* Tarjeta de Sesión Activa si ya existe token */}
          {session.token && session.user && (
            <div className="mb-2.5 bg-[#E2F2F3]/70 border border-[#0D7C84]/30 rounded-xl p-2.5 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#0D7C84] flex items-center gap-1.5 text-xs">
                  <span className="h-2 w-2 rounded-full bg-[#0D7C84] animate-pulse"></span>
                  Sesión: {session.user.nombre}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 font-bold underline cursor-pointer text-xs"
                >
                  Cerrar
                </button>
              </div>
              <p className="text-slate-600 truncate text-[11px]">
                Token ({TOKEN_STORAGE_KEY}): <code className="text-[#0D7C84] font-mono">{session.token.slice(0, 24)}...</code>
              </p>
            </div>
          )}

          {/* Alertas */}
          {notice && (
            <div
              role="alert"
              className="mb-2.5 p-2.5 rounded-xl bg-[#E2F2F3] border border-[#0D7C84]/30 text-[#0D7C84] text-xs flex items-start gap-2"
            >
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#0D7C84]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-bold text-slate-800">Sesión Finalizada</p>
                <p className="text-[#0D7C84] text-[11px]">{notice}</p>
              </div>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mb-2.5 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2"
            >
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div
              role="alert"
              className="mb-2.5 p-2.5 rounded-xl bg-[#E2F2F3] border border-[#0D7C84]/30 text-[#0D7C84] text-xs flex items-start gap-2"
            >
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#0D7C84]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-bold text-slate-800">{success}</p>
                <p className="text-[#0D7C84] text-[11px]">Token temporal generado en LocalStorage.</p>
              </div>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} noValidate className="space-y-2.5 sm:space-y-3">
            <div>
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-semibold text-slate-700 mb-0.5"
              >
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                placeholder="juan@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl border border-slate-300 text-sm sm:text-base transition-all focus:outline-none focus:ring-2 focus:border-[#0D7C84] focus:ring-[#0D7C84]/20 bg-white text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label
                htmlFor="current-password"
                className="block text-xs sm:text-sm font-semibold text-slate-700 mb-0.5"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="current-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="Tu contraseña registrada"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 sm:py-2.5 pr-11 rounded-xl border border-slate-300 text-sm sm:text-base transition-all focus:outline-none focus:ring-2 focus:border-[#0D7C84] focus:ring-[#0D7C84]/20 bg-white text-slate-800 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#64748B] hover:text-slate-800 focus:outline-none cursor-pointer"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Botón Submit */}
            <div className="pt-1.5 sm:pt-2">
              <button
                type="submit"
                className="w-full py-2.5 sm:py-3 px-4 bg-[#0D7C84] hover:bg-[#0A646A] active:scale-[0.99] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition duration-150 ease-in-out cursor-pointer text-sm sm:text-base tracking-wide"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>

          {/* Enlace para ir al Registro */}
          <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-slate-100 text-center">
            <p className="text-xs sm:text-sm text-[#64748B]">
              ¿Aún no tienes cuenta de propietario?{' '}
              {onNavigateToRegister ? (
                <button
                  type="button"
                  onClick={onNavigateToRegister}
                  className="font-bold text-[#0D7C84] hover:text-[#0A646A] underline ml-1 cursor-pointer"
                >
                  Regístrate aquí
                </button>
              ) : (
                <span className="font-bold text-[#0D7C84] ml-1">
                  Usa la pestaña de Registro
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Cuentas de prueba en LocalStorage - Plegado compacto para no generar scroll */}
      {registeredUsers.length > 0 && (
        <div className="mt-2 bg-white/90 rounded-xl p-2.5 sm:p-3 border border-slate-200 shadow-xs text-xs">
          <div className="flex items-center justify-between">
            <p className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
              <span className="text-[#F59E0B]">💡</span> Cuentas en LocalStorage ({registeredUsers.length})
            </p>
            <button
              type="button"
              onClick={() => setShowTestAccounts(!showTestAccounts)}
              className="text-xs text-[#64748B] hover:text-[#0D7C84] font-semibold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            >
              {showTestAccounts ? 'Ocultar' : 'Autocompletar'}
            </button>
          </div>

          {showTestAccounts && (
            <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-2">
              {registeredUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickFill(u)}
                  className="px-2.5 py-1 rounded-lg bg-[#E2F2F3] hover:bg-[#d4ecee] text-[#0D7C84] border border-[#0D7C84]/20 text-left transition cursor-pointer"
                >
                  <span className="font-semibold block text-xs">{u.nombre}</span>
                  <span className="text-[10px] text-[#64748B] block">{u.email}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
