import { useState } from 'react';
import vetHeroImg from './assets/vet-hero.png';
import { registerOwner, getRegisteredUsers, clearRegisteredUsers } from './authService';

export default function Register({ onNavigateToLogin }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState(() => getRegisteredUsers());
  const [showStorageData, setShowStorageData] = useState(false);

  const refreshUsersList = () => {
    setRegisteredUsers(getRegisteredUsers());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    if (submitError) setSubmitError('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre completo es obligatorio.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Ingresa un correo electrónico válido.';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono de contacto es obligatorio.';
    } else if (!/^[0-9+-\s()]{7,15}$/.test(formData.telefono.trim())) {
      newErrors.telefono = 'Ingresa un número telefónico válido (mínimo 7 dígitos).';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError('');
    setSuccessMessage('');

    if (!validate()) return;

    const result = registerOwner({
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      direccion: formData.direccion,
      password: formData.password,
    });

    if (result.success) {
      setSuccessMessage(
        `¡Propietario ${result.user.nombre} registrado con éxito en LocalStorage!`
      );
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        password: '',
        confirmPassword: '',
      });
      refreshUsersList();
    } else {
      setSubmitError(result.error || 'Ocurrió un error al registrar.');
    }
  };

  const handleClearUsers = () => {
    if (window.confirm('¿Seguro que deseas vaciar los usuarios de prueba en LocalStorage?')) {
      clearRegisteredUsers();
      refreshUsersList();
      setSuccessMessage('LocalStorage limpiado con éxito.');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#E2F2F3] py-2 sm:py-4 px-3 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-5xl my-auto">
        {/* Tarjeta Split-Screen con paddings y margins compactos */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          
          {/* Panel Lateral Izquierdo: Formulario con espaciado vertical reducido */}
          <div className="p-4 sm:p-6 lg:p-7 flex flex-col justify-center bg-white order-2 lg:order-1">
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
                  Clínica Veterinaria &bull; Registro de Propietario (US 01)
                </p>
              </div>
            </div>

            {/* Título y subtítulo */}
            <div className="mb-2.5 sm:mb-3">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight leading-snug">
                Crear Cuenta de Propietario
              </h3>
              <p className="text-xs text-[#64748B]">
                Registra tus datos para solicitar citas médicas para tus mascotas.
              </p>
            </div>

            {/* Alertas compactas */}
            {submitError && (
              <div
                role="alert"
                className="mb-2.5 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2"
              >
                <svg
                  className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500"
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
                <span>{submitError}</span>
              </div>
            )}

            {successMessage && (
              <div
                role="alert"
                className="mb-2.5 p-2.5 rounded-xl bg-[#E2F2F3] border border-[#0D7C84]/30 text-[#0D7C84] text-xs flex items-start gap-2"
              >
                <svg
                  className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#0D7C84]"
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
                  <p className="font-bold text-slate-800">{successMessage}</p>
                  <p className="text-[#0D7C84] text-[11px]">Guardado en LocalStorage con éxito.</p>
                </div>
              </div>
            )}

            {/* Formulario compacto sin scroll */}
            <form onSubmit={handleSubmit} noValidate className="space-y-2 sm:space-y-2.5">
              {/* Campo: Nombre Completo */}
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-xs sm:text-sm font-semibold text-slate-700 mb-0.5"
                >
                  Nombre Completo <span className="text-[#F59E0B]">*</span>
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  autoComplete="name"
                  placeholder="Ej. Juan Pérez"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`w-full px-3 py-1.5 sm:py-2 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 text-slate-800 placeholder:text-slate-400 bg-white ${
                    errors.nombre
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                      : 'border-slate-300 focus:border-[#0D7C84] focus:ring-[#0D7C84]/20'
                  }`}
                />
                {errors.nombre && (
                  <p className="mt-0.5 text-[11px] text-red-600 font-medium">{errors.nombre}</p>
                )}
              </div>

              {/* Grid 2 Columnas: Email y Teléfono */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs sm:text-sm font-semibold text-slate-700 mb-0.5"
                  >
                    Correo Electrónico <span className="text-[#F59E0B]">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    placeholder="juan@ejemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-1.5 sm:py-2 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 text-slate-800 placeholder:text-slate-400 bg-white ${
                      errors.email
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                        : 'border-slate-300 focus:border-[#0D7C84] focus:ring-[#0D7C84]/20'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-0.5 text-[11px] text-red-600 font-medium">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="telefono"
                    className="block text-xs sm:text-sm font-semibold text-slate-700 mb-0.5"
                  >
                    Teléfono / Móvil <span className="text-[#F59E0B]">*</span>
                  </label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="987654321"
                    value={formData.telefono}
                    onChange={handleChange}
                    className={`w-full px-3 py-1.5 sm:py-2 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 text-slate-800 placeholder:text-slate-400 bg-white ${
                      errors.telefono
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                        : 'border-slate-300 focus:border-[#0D7C84] focus:ring-[#0D7C84]/20'
                    }`}
                  />
                  {errors.telefono && (
                    <p className="mt-0.5 text-[11px] text-red-600 font-medium">{errors.telefono}</p>
                  )}
                </div>
              </div>

              {/* Campo: Dirección */}
              <div>
                <label
                  htmlFor="direccion"
                  className="block text-xs sm:text-sm font-semibold text-slate-700 mb-0.5"
                >
                  Dirección <span className="text-[10px] text-[#64748B] font-normal">(Opcional)</span>
                </label>
                <input
                  id="direccion"
                  name="direccion"
                  type="text"
                  autoComplete="street-address"
                  placeholder="Av. Principal 123, Distrito"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 sm:py-2 rounded-xl border border-slate-300 text-sm transition-all focus:outline-none focus:ring-2 focus:border-[#0D7C84] focus:ring-[#0D7C84]/20 bg-white text-slate-800 placeholder:text-slate-400"
                />
              </div>

              {/* Grid 2 Columnas: Contraseña y Confirmación */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                <div>
                  <label
                    htmlFor="new-password"
                    className="block text-xs sm:text-sm font-semibold text-slate-700 mb-0.5"
                  >
                    Contraseña <span className="text-[#F59E0B]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Mín. 6 caracteres"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-3 py-1.5 sm:py-2 pr-10 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 text-slate-800 placeholder:text-slate-400 bg-white ${
                        errors.password
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                          : 'border-slate-300 focus:border-[#0D7C84] focus:ring-[#0D7C84]/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#64748B] hover:text-slate-800 focus:outline-none cursor-pointer"
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
                  {errors.password && (
                    <p className="mt-0.5 text-[11px] text-red-600 font-medium">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs sm:text-sm font-semibold text-slate-700 mb-0.5"
                  >
                    Repetir Contraseña <span className="text-[#F59E0B]">*</span>
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Repite tu contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-3 py-1.5 sm:py-2 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 text-slate-800 placeholder:text-slate-400 bg-white ${
                      errors.confirmPassword
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                        : 'border-slate-300 focus:border-[#0D7C84] focus:ring-[#0D7C84]/20'
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-0.5 text-[11px] text-red-600 font-medium">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Botón Submit: visible al 100% sin scroll */}
              <div className="pt-1.5 sm:pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 sm:py-3 px-4 bg-[#0D7C84] hover:bg-[#0A646A] active:scale-[0.99] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition duration-150 ease-in-out cursor-pointer text-sm sm:text-base tracking-wide"
                >
                  Registrar Propietario
                </button>
              </div>
            </form>

            {/* Enlace para ir al Login */}
            <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-slate-100 text-center">
              <p className="text-xs sm:text-sm text-[#64748B]">
                ¿Ya tienes una cuenta registrada?{' '}
                {onNavigateToLogin ? (
                  <button
                    type="button"
                    onClick={onNavigateToLogin}
                    className="font-bold text-[#0D7C84] hover:text-[#0A646A] underline ml-1 cursor-pointer"
                  >
                    Inicia sesión aquí
                  </button>
                ) : (
                  <span className="font-bold text-[#0D7C84] ml-1">
                    Usa la opción de Iniciar Sesión
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Panel Lateral Derecho: Hero con Imagen Superpuesta (Register - Flujo Simétrico) */}
          <div className="relative min-h-[280px] sm:min-h-[340px] lg:min-h-full flex flex-col justify-between p-6 sm:p-8 lg:p-10 overflow-hidden bg-slate-900 order-1 lg:order-2">
            {/* Imagen importada desde ./assets/vet-hero.png */}
            <img
              src={vetHeroImg}
              alt="Veterinaria VetCare y cachorrito"
              className="absolute inset-0 w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 opacity-80"
            />

            {/* Capa de degradado con tono Primary (#0D7C84) para legibilidad */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D7C84]/95 via-[#0D7C84]/65 to-slate-900/40" />

            {/* Contenido Superpuesto Superior */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold shadow-sm">
                <span>🐾</span>
                <span>Únete a la Familia VetCare</span>
              </div>
            </div>

            {/* Contenido Superpuesto Inferior: Título y Texto */}
            <div className="relative z-10 space-y-2 sm:space-y-2.5">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight tracking-tight drop-shadow-sm">
                El mejor comienzo para la salud de tus mascotas
              </h2>
              <p className="text-xs sm:text-sm text-slate-100/95 leading-relaxed max-w-md">
                Crea tu cuenta de propietario en segundos para registrar a tus mascotas, agendar consultas con nuestros veterinarios certificados y recibir recordatorios preventivos.
              </p>

              <div className="pt-2 border-t border-white/20 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-white/95 font-medium">
                <span>✓ Registro gratuito</span>
                <span>✓ Notificaciones</span>
                <span>✓ Atención con amor</span>
              </div>
            </div>
          </div>

        </div>

        {/* Panel de Inspección de LocalStorage (Evidencia US 01) - Plegado por defecto para no generar scroll */}
        <div className="mt-2.5 bg-white/90 rounded-xl p-2.5 sm:p-3 border border-slate-200 shadow-xs text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F59E0B]"></span>
              </span>
              <h3 className="text-xs font-bold text-slate-700">
                LocalStorage: Arreglo de Propietarios ({registeredUsers.length})
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowStorageData(!showStorageData)}
                className="text-xs text-[#64748B] hover:text-[#0D7C84] font-semibold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              >
                {showStorageData ? 'Ocultar datos' : 'Ver registros'}
              </button>
              {registeredUsers.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearUsers}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-0.5 rounded-md bg-red-50 hover:bg-red-100 transition cursor-pointer"
                >
                  Vaciar
                </button>
              )}
            </div>
          </div>

          {showStorageData && (
            <div className="mt-2.5 pt-2 border-t border-slate-100">
              {registeredUsers.length === 0 ? (
                <div className="text-center py-2 text-xs text-[#64748B]">
                  No hay propietarios en <code className="bg-slate-100 px-1 py-0.5 rounded text-[#0D7C84] font-semibold">localStorage.getItem(&apos;vet_users&apos;)</code>.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {registeredUsers.map((user, index) => (
                    <div
                      key={user.id || index}
                      className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 flex items-center justify-between"
                    >
                      <span className="font-semibold text-slate-800">
                        #{index + 1} {user.nombre} ({user.email})
                      </span>
                      <span className="text-[10px] text-[#64748B]">{user.telefono}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
