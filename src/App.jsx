import { useState, useEffect } from 'react';
import {
  Login,
  Register,
  Dashboard,
  LogoutButton,
  isAuthenticated,
  logoutUser,
} from './auth';

function App() {
  const [currentView, setCurrentView] = useState(() =>
    isAuthenticated() ? 'dashboard' : 'login'
  );
  const [hasAuth, setHasAuth] = useState(() => isAuthenticated());
  const [logoutNotice, setLogoutNotice] = useState('');

  // Escuchar eventos globales de cierre de sesión
  useEffect(() => {
    const handleAuthLogout = () => {
      setHasAuth(false);
      setCurrentView('login');
      setLogoutNotice(
        'Sesión cerrada correctamente. El token temporal fue eliminado de LocalStorage.'
      );
    };

    window.addEventListener('auth:logout', handleAuthLogout);
    return () => window.removeEventListener('auth:logout', handleAuthLogout);
  }, []);

  const handleLoginSuccess = () => {
    setHasAuth(true);
    setLogoutNotice('');
    setCurrentView('dashboard');
  };

  const handleRedirectToLoginAfterLogout = () => {
    logoutUser(() => {
      setHasAuth(false);
      setLogoutNotice(
        'Sesión cerrada correctamente. El token temporal fue eliminado de LocalStorage.'
      );
      setCurrentView('login');
    });
  };

  const handleNavigate = (view) => {
    if (view !== 'login') {
      setLogoutNotice('');
    }
    setCurrentView(view);
  };

  return (
    <div>
      {/* Navegación superior con estados de las historias de usuario */}
      <header className="bg-white/85 backdrop-blur border-b border-slate-200 sticky top-0 z-50 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                hasAuth ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
              }`}
            ></span>
            <span className="text-xs font-bold text-slate-800 tracking-wide">
              Clínica Veterinaria &bull; Módulo Auth
            </span>
            {hasAuth && (
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Token Activo
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {hasAuth && (
                <button
                  type="button"
                  onClick={() => handleNavigate('dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    currentView === 'dashboard'
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Panel Propietario
                </button>
              )}
              <button
                type="button"
                onClick={() => handleNavigate('login')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  currentView === 'login'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                US 02: Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('register')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  currentView === 'register'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                US 01: Registro
              </button>
            </div>

            {/* US 03: Botón de Cierre de Sesión en el Header */}
            {hasAuth && (
              <LogoutButton
                onRedirectToLogin={handleRedirectToLoginAfterLogout}
                label="US 03: Salir"
                className="py-1.5 px-3"
              />
            )}
          </div>
        </div>
      </header>

      {/* Vista Activa */}
      <main>
        {currentView === 'dashboard' && hasAuth ? (
          <Dashboard onRedirectToLogin={handleRedirectToLoginAfterLogout} />
        ) : currentView === 'register' ? (
          <Register onNavigateToLogin={() => handleNavigate('login')} />
        ) : (
          <Login
            key={logoutNotice}
            logoutNotice={logoutNotice}
            onNavigateToRegister={() => handleNavigate('register')}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </main>
    </div>
  );
}

export default App;
