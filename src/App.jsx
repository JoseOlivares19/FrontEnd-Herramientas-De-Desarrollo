import { useState } from 'react';
import { Login, Register, isAuthenticated } from './auth';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [hasAuth, setHasAuth] = useState(() => isAuthenticated());

  const handleLoginSuccess = () => {
    setHasAuth(true);
  };

  return (
    <div>
      {/* Navegación de prueba para historias de usuario */}
      <header className="bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                hasAuth ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
              }`}
            ></span>
            <span className="text-xs font-bold text-slate-700 tracking-wide">
              Módulo Auth &bull; Clínica Veterinaria{' '}
              {hasAuth && (
                <span className="text-emerald-600 font-normal">
                  (Token Activo en LocalStorage)
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setCurrentView('login')}
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
              onClick={() => setCurrentView('register')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                currentView === 'register'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              US 01: Registro
            </button>
          </div>
        </div>
      </header>

      {/* Vista Activa */}
      <main>
        {currentView === 'login' ? (
          <Login
            onNavigateToRegister={() => setCurrentView('register')}
            onLoginSuccess={handleLoginSuccess}
          />
        ) : (
          <Register onNavigateToLogin={() => setCurrentView('login')} />
        )}
      </main>
    </div>
  );
}

export default App;
