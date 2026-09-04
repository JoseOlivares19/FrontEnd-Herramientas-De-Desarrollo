const USERS_STORAGE_KEY = 'vet_users';
const TOKEN_STORAGE_KEY = 'vet_auth_token';
const CURRENT_USER_STORAGE_KEY = 'vet_current_user';

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

  if (isEmailRegistered(normalizedEmail)) {
    return { success: false, error: 'El correo electrónico ya se encuentra registrado.' };
  }

  const newOwner = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    nombre: nombre.trim(),
    email: normalizedEmail,
    telefono: telefono.trim(),
    direccion: direccion.trim(),
    password, // Almacenamiento simulado en backend local
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
 * Genera un token temporal simulado.
 * @param {Object} user
 * @returns {string} Token temporal con datos codificados y timestamp.
 */
const generateTemporaryToken = (user) => {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // Validez de 24 horas
  };

  try {
    const encodedPayload = btoa(JSON.stringify(payload)).replace(/=+$/, '');
    return `vet_tk_${encodedPayload}_${Date.now()}`;
  } catch {
    return `vet_tk_${user.id}_${Date.now()}`;
  }
};

/**
 * Valida el ingreso buscando al usuario en LocalStorage y guarda un token temporal (US 02).
 * @param {{ email: string, password: string }} credentials - Credenciales de acceso.
 * @returns {{ success: boolean, token?: string, user?: Object, error?: string }}
 */
export const loginUser = ({ email, password }) => {
  if (!email?.trim()) {
    return { success: false, error: 'Ingresa tu correo electrónico.' };
  }
  if (!password) {
    return { success: false, error: 'Ingresa tu contraseña.' };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const users = getRegisteredUsers();

  // Buscar usuario en el arreglo de LocalStorage
  const foundUser = users.find(
    (user) => user.email.toLowerCase() === normalizedEmail
  );

  if (!foundUser) {
    return {
      success: false,
      error: 'No existe una cuenta registrada con este correo electrónico.',
    };
  }

  // Validar contraseña
  if (foundUser.password !== password) {
    return {
      success: false,
      error: 'Contraseña incorrecta. Por favor, verifica tus datos.',
    };
  }

  // Generar token temporal
  const token = generateTemporaryToken(foundUser);

  // Objeto de sesión seguro (sin exponer la contraseña)
  const sessionUser = {
    id: foundUser.id,
    nombre: foundUser.nombre,
    email: foundUser.email,
    telefono: foundUser.telefono,
    direccion: foundUser.direccion || '',
    role: foundUser.role || 'propietario',
  };

  try {
    // Guardar token temporal y usuario activo en LocalStorage
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(sessionUser));

    return {
      success: true,
      token,
      user: sessionUser,
    };
  } catch (error) {
    console.error('Error al guardar token temporal en LocalStorage:', error);
    return {
      success: false,
      error: 'No se pudo guardar la sesión en LocalStorage.',
    };
  }
};

/**
 * Obtiene el token temporal actual desde LocalStorage.
 * @returns {string|null}
 */
export const getAuthToken = () => {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('Error al obtener token de LocalStorage:', error);
    return null;
  }
};

/**
 * Obtiene los datos del usuario en sesión activa.
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Error al obtener usuario actual de LocalStorage:', error);
    return null;
  }
};

/**
 * Verifica si hay una sesión activa con token en LocalStorage.
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return Boolean(getAuthToken());
};

/**
 * Cierra la sesión eliminando el token temporal y el usuario de LocalStorage.
 */
export const logoutUser = () => {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  } catch (error) {
    console.error('Error al cerrar sesión en LocalStorage:', error);
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

export { USERS_STORAGE_KEY, TOKEN_STORAGE_KEY, CURRENT_USER_STORAGE_KEY };
