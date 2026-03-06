import React, { useState } from 'react';
import DriverHome from './pages/driver/DriverHome';
import MarketDashboard from './pages/market/MarketDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { User, Store, Lock } from 'lucide-react';
import { clsx } from 'clsx';

const LoginScreen = () => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState('checking'); // checking, online, offline

  React.useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch('https://dof-b.onrender.com/test-server', { mode: 'no-cors' });
        // Since we use no-cors, we can't see the status, but if it doesn't throw, it's likely reachable
        setServerStatus('online');
      } catch (err) {
        setServerStatus('offline');
      }
    };
    checkServer();
    const interval = setInterval(checkServer, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    if (!selectedRole) {
      setError('يرجى اختيار نوع الحساب');
      return;
    }

    if (!username.trim()) {
      setError('يرجى إدخال اسم المستخدم');
      return;
    }

    if (!password.trim()) {
      setError('يرجى إدخال كلمة المرور');
      return;
    }

    // Platform Segregation Update: Map role to platform identifier
    const platform = selectedRole === 'market_owner' ? 'MARKET_DASHBOARD' : 'DRIVER_APP';

    const result = await login(username, password, platform);

    if (result.success) {
      setError('');
    } else {
      setError(result.message || 'اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2874&auto=format&fit=crop')] bg-cover bg-center opacity-20 blur-sm"></div>

      <div className="z-10 w-full max-w-sm space-y-8 animate-slide-up">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">توتو ديليفري</h1>
          <p className="text-neutral-400 font-bold italic">دخول النظام الآمن</p>

          {serverStatus === 'online' && (
            <div className="mt-4 flex items-center justify-center gap-2 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Server Live
              </span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {!selectedRole ? (
            <div className="space-y-6 animate-fade-in">
              <p className="text-neutral-400 text-center text-sm font-bold mb-4">اختر نوع الحساب للمتابعة</p>
              <div className="flex gap-4">
                <button
                  onClick={() => { setSelectedRole('driver'); setError(''); }}
                  className="flex-1 p-6 rounded-3xl border border-white/10 bg-white/5 hover:bg-primary-500/10 hover:border-primary-500/50 transition-all flex flex-col items-center gap-3 group"
                >
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all">
                    <User className="w-8 h-8" />
                  </div>
                  <span className="text-sm font-black text-white">كابتن</span>
                </button>
                <button
                  onClick={() => { setSelectedRole('market_owner'); setError(''); }}
                  className="flex-1 p-6 rounded-3xl border border-white/10 bg-white/5 hover:bg-orange-500/10 hover:border-orange-500/50 transition-all flex flex-col items-center gap-3 group"
                >
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
                    <Store className="w-8 h-8" />
                  </div>
                  <span className="text-sm font-black text-white">صاحب متجر</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-2 animate-slide-up">
              <div className="flex items-center gap-3 mb-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className={clsx(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg",
                  selectedRole === 'driver' ? "bg-primary-500 shadow-primary-500/20" : "bg-orange-500 shadow-orange-500/20"
                )}>
                  {selectedRole === 'driver' ? <User className="w-6 h-6" /> : <Store className="w-6 h-6" />}
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">تسجيل الدخول كـ</p>
                  <p className="text-sm font-extrabold text-white">{selectedRole === 'driver' ? 'كابتن (سائق)' : 'صاحب متجر'}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="اسم المستخدم"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white font-bold outline-none focus:border-primary-500 focus:bg-white/10 transition-all text-right"
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="password"
                    placeholder="كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white font-bold outline-none focus:border-primary-500 focus:bg-white/10 transition-all text-right tracking-[0.5em]"
                  />
                </div>
              </div>

              {error && <p className="text-red-400 text-[10px] font-bold text-center animate-pulse pt-2">{error}</p>}

              <button
                onClick={handleLogin}
                className={clsx(
                  "w-full py-5 text-lg font-black mt-4 shadow-2xl rounded-2xl transition-all active:scale-[0.98]",
                  selectedRole === 'driver' ? "btn-primary" : "bg-orange-600 hover:bg-orange-500 text-white"
                )}
              >
                دخول للنظام
              </button>

              <p className="text-[10px] text-neutral-500 text-center font-bold pt-4">
                تأكد من إدخال بياناتك الصحيحة للمتابعة
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { user, token, loading, logout } = useAuth();

  // Automatic Logout: Clear session if role is not recognized for this dashboard platform
  React.useEffect(() => {
    if (!loading && token && user) {
      const allowedRoles = ['market_owner', 'driver', 'admin'];
      if (!allowedRoles.includes(user.role)) {
        console.warn('Security Alert: Role mismatch detected. Logging out.');
        logout();
      }
    }
  }, [user, token, loading, logout]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white font-black">جاري التحميل...</div>;

  // Real Token-based Route Guard
  const isAuthenticated = !!token && !!user;

  if (!isAuthenticated) return <LoginScreen />;

  if (user.role === 'market_owner') {
    return <MarketDashboard />;
  }

  if (user.role === 'driver') {
    return <DriverHome />;
  }

  // Handle Admin or fallback
  if (user.role === 'admin') {
    // If there was an AdminDashboard, it would go here. 
    // For now, redirect to login or show error.
    return <LoginScreen />;
  }

  return <LoginScreen />;
};

function App() {
  return (
    <div className="App min-h-screen bg-transparent font-tajawal">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </div>
  );
}

export default App;
