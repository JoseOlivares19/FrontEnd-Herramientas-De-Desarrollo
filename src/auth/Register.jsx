import { useState } from 'react';
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
  const [showStorageData, setShowStorageData] = useState(true);

  // Cargar usuarios registrados desde LocalStorage
  const refreshUsersList = () => {
    setRegisteredUsers(getRegisteredUsers());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error específico al escribir
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
        `¡Propietario ${result.user.nombre} registrado exitosamente en LocalStorage!`
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      {/* Contenedor Principal */}
      <div className="w-full max-w-xl">
        {/* Cabecera / Branding */}
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
            Módulo de Autenticación &bull; US 01
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Registro de nuevo propietario (Persistencia en LocalStorage)
          </p>
        </div>

        {/* Tarjeta del Formulario */}
        <div className="bg-white/95 backdrop-blur shadow-xl rounded-2xl p-6 sm:p-8 border border-emerald-100">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-800">
              Crear Cuenta de Propietario
            </h2>
            <p className="text-sm text-slate-500">
              Registra tus datos para solicitar citas médicas para tus mascotas.
            </p>
          </div>

          {/* Mensajes de Alerta */}
          {submitError && (
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
              <span>{submitError}</span>
            </div>
          )}

          {successMessage && (
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
                <p className="font-semibold">{successMessage}</p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  El registro fue incorporado al arreglo en LocalStorage con éxito.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Campo: Nombre Completo */}
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-semibold text-slate-700 mb-1"
              >
                Nombre Completo <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  autoComplete="name"
                  placeholder="Ej. Juan Pérez"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.nombre
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                      : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-200 bg-white'
                  }`}
                />
              </div>
              {errors.nombre && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.nombre}</p>
              )}
            </div>

            {/* Dos columnas: Email y Teléfono */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Campo: Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700 mb-1"
                >
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="juan@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                      : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-200 bg-white'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.email}</p>
                )}
              </div>

              {/* Campo: Teléfono */}
              <div>
                <label
                  htmlFor="telefono"
                  className="block text-sm font-semibold text-slate-700 mb-1"
                >
                  Teléfono / Móvil <span className="text-red-500">*</span>
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
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.telefono
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                      : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-200 bg-white'
                  }`}
                />
                {errors.telefono && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.telefono}</p>
                )}
              </div>
            </div>

            {/* Campo: Dirección (Opcional) */}
            <div>
              <label
                htmlFor="direccion"
                className="block text-sm font-semibold text-slate-700 mb-1"
              >
                Dirección <span className="text-xs text-slate-400 font-normal">(Opcional)</span>
              </label>
              <input
                id="direccion"
                name="direccion"
                type="text"
                autoComplete="street-address"
                placeholder="Av. Principal 123, Distrito"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm transition-all focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-200 bg-white"
              />
            </div>

            {/* Dos columnas: Contraseña y Confirmar Contraseña */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Campo: Password */}
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-semibold text-slate-700 mb-1"
                >
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 pr-10 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                      errors.password
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                        : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-200 bg-white'
                    }`}
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
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.password}</p>
                )}
              </div>

              {/* Campo: Confirmar Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-slate-700 mb-1"
                >
                  Repetir Contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                      : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-200 bg-white'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Botón Submit */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition duration-150 ease-in-out cursor-pointer"
              >
                Registrar Propietario
              </button>
            </div>

            {/* Enlace a Inicio de Sesión */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                ¿Ya tienes una cuenta registrada?{' '}
                {onNavigateToLogin ? (
                  <button
                    type="button"
                    onClick={onNavigateToLogin}
                    className="font-semibold text-emerald-600 hover:text-emerald-700 underline ml-1 cursor-pointer"
                  >
                    Inicia sesión aquí
                  </button>
                ) : (
                  <span className="font-semibold text-emerald-600 ml-1">
                    Usa la opción de Iniciar Sesión
                  </span>
                )}
              </p>
            </div>
          </form>
        </div>

        {/* Panel de Inspección de LocalStorage (Evidencia US 01) */}
        <div className="mt-8 bg-white/90 backdrop-blur rounded-2xl p-5 border border-slate-200 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <h3 className="text-sm font-bold text-slate-700">
                LocalStorage: Arreglo de Propietarios ({registeredUsers.length})
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowStorageData(!showStorageData)}
                className="text-xs text-slate-600 hover:text-emerald-700 font-medium px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition"
              >
                {showStorageData ? 'Ocultar' : 'Mostrar'}
              </button>
              {registeredUsers.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearUsers}
                  className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 transition"
                >
                  Vaciar LocalStorage
                </button>
              )}
            </div>
          </div>

          {showStorageData && (
            <div className="mt-4">
              {registeredUsers.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl">
                  <p className="text-xs text-slate-500">
                    Aún no hay propietarios en el arreglo de <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-700">localStorage.getItem(&apos;vet_users&apos;)</code>.
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Completa el formulario superior para registrar el primero.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {registeredUsers.map((user, index) => (
                    <div
                      key={user.id || index}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1"
                    >
                      <div className="flex items-center justify-between font-semibold text-emerald-800">
                        <span>
                          #{index + 1} &bull; {user.nombre}
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px]">
                          {user.role}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-0.5 text-slate-600">
                        <p>
                          <span className="font-medium text-slate-500">Email:</span> {user.email}
                        </p>
                        <p>
                          <span className="font-medium text-slate-500">Teléfono:</span> {user.telefono}
                        </p>
                        {user.direccion && (
                          <p className="sm:col-span-2">
                            <span className="font-medium text-slate-500">Dirección:</span> {user.direccion}
                          </p>
                        )}
                        <p className="sm:col-span-2 text-[10px] text-slate-400">
                          ID: {user.id} &bull; Creado: {new Date(user.createdAt).toLocaleString()}
                        </p>
                      </div>
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
