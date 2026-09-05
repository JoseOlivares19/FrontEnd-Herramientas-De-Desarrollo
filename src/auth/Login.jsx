import { useState } from 'react';
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-md">
        {/* Encabezado / Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-600 text-white shadow-lg mb-3">
            <svg
              className="w-9 h-9"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Clínica Veterinaria
          </h1>
          <p className="text-sm font-medium text-emerald-700 mt-1">
            Módulo de Autenticación &bull; US 02
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Inicio de sesión con validación y token temporal en LocalStorage
          </p>
        </div>

        {/* Tarjeta de Sesión Activa (Si ya existe token en LocalStorage) */}
        {session.token && session.user && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Sesión Activa
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs text-red-600 hover:text-red-700 font-semibold px-2.5 py-1 rounded-lg bg-red-100/60 hover:bg-red-100 transition"
              >
                Cerrar Sesión
              </button>
            </div>
            <p className="text-sm font-bold text-slate-800">
              {session.user.nombre}
            </p>
            <p className="text-xs text-slate-600">
              {session.user.email} &bull; Rol: <span className="font-medium text-emerald-700">{session.user.role}</span>
            </p>
            <div className="mt-3 pt-3 border-t border-emerald-200/80">
              <p className="text-[11px] font-semibold text-emerald-900 mb-1">
                Token temporal guardado (<code className="text-emerald-700 font-mono">{TOKEN_STORAGE_KEY}</code>):
              </p>
              <div className="p-2 bg-white/80 rounded-lg border border-emerald-200 text-[10px] font-mono text-slate-700 break-all select-all">
                {session.token}
              </div>
            </div>
          </div>
        )}

        {/* Tarjeta de Formulario de Inicio de Sesión */}
        <div className="bg-white/95 backdrop-blur shadow-xl rounded-2xl p-6 sm:p-8 border border-emerald-100">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-800">
              Iniciar Sesión
            </h2>
            <p className="text-sm text-slate-500">
              Ingresa tus credenciales para acceder al sistema.
            </p>
          </div>

          {/* Alerta de Cierre de Sesión / Notificación (US 03) */}
          {notice && (
            <div
              role="alert"
              className="mb-5 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-sm flex items-start gap-3"
            >
              <svg
                className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="font-semibold">Sesión Finalizada</p>
                <p className="text-xs text-blue-600 mt-0.5">{notice}</p>
              </div>
            </div>
          )}

          {/* Alerta de Error */}
          {error && (
            <div
              role="alert"
              className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3"
            >
              <svg
                className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Alerta de Éxito */}
          {success && (
            <div
              role="alert"
              className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3"
            >
              <svg
                className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="font-semibold">{success}</p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  Token temporal generado y guardado en LocalStorage.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Campo: Correo Electrónico */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700 mb-1"
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm transition-all focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-200 bg-white"
              />
            </div>

            {/* Campo: Contraseña */}
            <div>
              <label
                htmlFor="current-password"
                className="block text-sm font-semibold text-slate-700 mb-1"
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
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-300 text-sm transition-all focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-200 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
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
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition duration-150 ease-in-out cursor-pointer"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>

          {/* Enlace para registrarse */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              ¿Aún no tienes cuenta de propietario?{' '}
              {onNavigateToRegister ? (
                <button
                  type="button"
                  onClick={onNavigateToRegister}
                  className="font-semibold text-emerald-600 hover:text-emerald-700 underline ml-1 cursor-pointer"
                >
                  Regístrate aquí
                </button>
              ) : (
                <span className="font-semibold text-emerald-600 ml-1">
                  Usa la pestaña de Registro
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Ayuda de prueba rápida: Usuarios registrados en LocalStorage */}
        {registeredUsers.length > 0 && (
          <div className="mt-6 bg-white/90 backdrop-blur rounded-2xl p-4 border border-slate-200 shadow-sm text-xs">
            <p className="font-semibold text-slate-700 mb-2">
              💡 Cuentas de prueba en LocalStorage ({registeredUsers.length}):
            </p>
            <p className="text-slate-500 mb-3 text-[11px]">
              Haz clic en cualquiera para autocompletar las credenciales:
            </p>
            <div className="flex flex-wrap gap-2">
              {registeredUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickFill(u)}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-left transition cursor-pointer"
                >
                  <span className="font-medium block">{u.nombre}</span>
                  <span className="text-[10px] text-slate-500 block">{u.email}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

