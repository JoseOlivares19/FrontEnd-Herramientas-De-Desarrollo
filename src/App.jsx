import { useState, useEffect } from 'react';
import {
  Login,
  Register,
  Dashboard,
  LogoutButton,
  ProtectedRoute,
  PublicRoute,
  isAuthenticated,
  logoutUser,
} from './auth';

function App() {
  const [currentView, setCurrentView] = useState(() =>
    isAuthenticated() ? 'dashboard' : 'login'
  );
  const [hasAuth, setHasAuth] = useState(() => isAuthenticated());
  const [logoutNotice, setLogoutNotice] = useState('');

  // Sincronizar estado global al cerrar sesión
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
    <div className="min-h-screen bg-[#E2F2F3] font-sans">
      {/* Barra de navegación superior con diseño pulido */}
      <header className="bg-white/95 backdrop-blur border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                hasAuth ? 'bg-[#0D7C84] animate-pulse' : 'bg-[#64748B]'
              }`}
            ></span>
            <span className="text-xs font-bold text-slate-800 tracking-wide">
              Clínica Veterinaria &bull; Sistema de Autenticación
            </span>
            {hasAuth ? (
              <span className="text-[10px] font-bold bg-[#E2F2F3] text-[#0D7C84] px-2.5 py-0.5 rounded-full border border-[#0D7C84]/20">
                Token Activo
              </span>
            ) : (
              <span className="text-[10px] font-medium bg-slate-100 text-[#64748B] px-2.5 py-0.5 rounded-full border border-slate-200">
                Sin Sesión
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
              {/* Botón para probar la Ruta Protegida (US 04) */}
              <button
                type="button"
                onClick={() => handleNavigate('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  currentView === 'dashboard'
                    ? 'bg-[#0D7C84] text-white shadow-sm'
                    : 'text-[#64748B] hover:text-slate-900'
                }`}
                title="Prueba el componente envolvente ProtectedRoute"
              >
                US 04: Ruta Protegida
              </button>

              <button
                type="button"
                onClick={() => handleNavigate('login')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  currentView === 'login'
                    ? 'bg-[#0D7C84] text-white shadow-sm'
                    : 'text-[#64748B] hover:text-slate-900'
                }`}
              >
                US 02: Iniciar Sesión
              </button>

              <button
                type="button"
                onClick={() => handleNavigate('register')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  currentView === 'register'
                    ? 'bg-[#0D7C84] text-white shadow-sm'
                    : 'text-[#64748B] hover:text-slate-900'
                }`}
              >
                US 01: Registro
              </button>
            </div>

            {/* US 03: Cerrar sesión */}
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

      {/* Renderizado mediante Componentes Envolventes (US 04) */}
      <main>
        {currentView === 'dashboard' ? (
          <ProtectedRoute onUnauthorized={() => handleNavigate('login')}>
            <Dashboard onRedirectToLogin={handleRedirectToLoginAfterLogout} />
          </ProtectedRoute>
        ) : currentView === 'register' ? (
          <PublicRoute onNavigateToDashboard={() => handleNavigate('dashboard')}>
            <Register onNavigateToLogin={() => handleNavigate('login')} />
          </PublicRoute>
        ) : (
          <PublicRoute onNavigateToDashboard={() => handleNavigate('dashboard')}>
            <Login
              key={logoutNotice}
              logoutNotice={logoutNotice}
              onNavigateToRegister={() => handleNavigate('register')}
              onLoginSuccess={handleLoginSuccess}
            />
          </PublicRoute>
        )}
      </main>
    </div>
  );
}

export default App;
