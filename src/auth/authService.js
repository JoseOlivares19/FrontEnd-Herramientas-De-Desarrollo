const USERS_STORAGE_KEY = 'vet_users';

/**
 * Obtiene la lista de todos los usuarios/propietarios registrados en LocalStorage.
 * @returns {Array} Arreglo de usuarios registrados.
 */
export const getRegisteredUsers = () => {
  try {
    const rawData = localStorage.getItem(USERS_STORAGE_KEY);
    if (!rawData) return [];
    const parsed = JSON.parse(rawData);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error al leer usuarios de LocalStorage:', error);
    return [];
  }
};

/**
 * Verifica si un correo electrónico ya se encuentra registrado.
 * @param {string} email
 * @returns {boolean}
 */
export const isEmailRegistered = (email) => {
  if (!email) return false;
  const users = getRegisteredUsers();
  return users.some((user) => user.email.toLowerCase() === email.trim().toLowerCase());
};

/**
 * Registra un nuevo propietario y lo guarda en el arreglo dentro de LocalStorage (US 01).
 * @param {Object} ownerData - Datos del propietario (nombre, email, telefono, password, direccion).
 * @returns {{ success: boolean, user?: Object, error?: string }}
 */
export const registerOwner = ({ nombre, email, telefono, password, direccion = '' }) => {
  // Validaciones básicas de campos obligatorios
  if (!nombre?.trim()) {
    return { success: false, error: 'El nombre completo es requerido.' };
  }
  if (!email?.trim()) {
    return { success: false, error: 'El correo electrónico es requerido.' };
  }
  if (!telefono?.trim()) {
    return { success: false, error: 'El teléfono es requerido.' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Validar unicidad del correo
  if (isEmailRegistered(normalizedEmail)) {
    return { success: false, error: 'El correo electrónico ya se encuentra registrado.' };
  }

  // Crear objeto del nuevo propietario
  const newOwner = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    nombre: nombre.trim(),
    email: normalizedEmail,
    telefono: telefono.trim(),
    direccion: direccion.trim(),
    password, // Simulación de almacenamiento de credenciales
    role: 'propietario',
    createdAt: new Date().toISOString(),
  };

  try {
    const currentUsers = getRegisteredUsers();
    const updatedUsers = [...currentUsers, newOwner];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

    return {
      success: true,
      user: newOwner,
    };
  } catch (error) {
    console.error('Error al guardar en LocalStorage:', error);
    return {
      success: false,
      error: 'Error al persistir los datos en LocalStorage.',
    };
  }
};

/**
 * Limpia la lista de usuarios en LocalStorage (útil para pruebas y desarrollo).
 */
export const clearRegisteredUsers = () => {
  try {
    localStorage.removeItem(USERS_STORAGE_KEY);
  } catch (error) {
    console.error('Error al limpiar usuarios de LocalStorage:', error);
  }
};

