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
  const [isLoading, setIsLoading] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(false);
  const [inputErrors, setInputErrors] = useState({ username: false, password: false });
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Connectivity Listener
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      showToast('مشكلة في الاتصال. يرجى التحقق من الإنترنت.', 'error');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const handleInputFocus = (field) => {
    setInputErrors(prev => ({ ...prev, [field]: false }));
  };

  const handleLogin = async () => {
    if (isLoading) return;

    if (!selectedRole) {
      showToast('يرجى اختيار نوع الحساب للمتابعة', 'error');
      return;
    }

    const errors = {
      username: !username.trim(),
      password: !password.trim()
    };

    if (errors.username || errors.password) {
      setInputErrors(errors);
      setShakeTrigger(true);
      setTimeout(() => setShakeTrigger(false), 500);
      return;
    }

    if (!isOnline) {
      showToast('مشكلة في الاتصال. يرجى التحقق من الإنترنت.', 'error');
      return;
    }

    setIsLoading(true);
    setInputErrors({ username: false, password: false });

    try {
      const platform = selectedRole === 'market_owner' ? 'MARKET_DASHBOARD' : 'DRIVER_APP';
      const result = await login(username, password, platform);

      if (result.success) {
        // Success handled by AuthContext updating state
      } else {
        setShakeTrigger(true);
        setInputErrors({ username: true, password: true });
        showToast('اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
        setTimeout(() => setShakeTrigger(false), 500);
      }
    } catch (err) {
      showToast('نواجه مشكلة في الاتصال بالخادم. يرجى المحاولة مرة أخرى لاحقاً.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormFilled = !!(username.trim() && password.trim());

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Layer */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2874&auto=format&fit=crop')] bg-cover bg-center opacity-20 blur-sm"></div>

      {/* Connectivity Banner (Top Snackbar) */}
      {!isOnline && (
        <div dir="rtl" className="fixed top-0 inset-x-0 z-50 bg-red-600/90 backdrop-blur-md py-2 px-6 flex items-center justify-center gap-2 animate-slide-in-top">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          <span className="text-[11px] font-black text-white uppercase tracking-widest">
            غير متصل • مشكلة في الاتصال
          </span>
        </div>
      )}

      {/* Toast Notification (Bottom) */}
      {toast.show && (
        <div dir="rtl" className="fixed bottom-10 z-[60] px-6 py-4 bg-neutral-800 border border-white/10 rounded-2xl shadow-2xl flex items-center gap-4 animate-slide-in-bottom text-right">
          <div className={clsx(
            "w-2 h-2 rounded-full",
            toast.type === 'error' ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]" : "bg-emerald-500"
          )}></div>
          <span className="text-sm font-bold text-white pr-2">{toast.message}</span>
        </div>
      )}

      <div className="z-10 w-full max-w-sm space-y-12 animate-slide-up">
        {/* Logo & Headline */}
        <div className="text-center group">
          <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mx-auto mb-6 relative border border-white/5 group-hover:bg-primary-500/10 transition-all duration-700 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <img src="/images/d-logo.svg" alt="Tutu" className="h-12 w-auto relative z-10" />
          </div>
          <h1 className="text-5xl font-black text-white mb-2 tracking-tighter opacity-90">توتو ديليفري</h1>
          <p className="text-neutral-500 font-bold italic text-sm tracking-wide">نظام التوزيع الذكي المتكامل</p>
        </div>

        <div className="space-y-6">
          {!selectedRole ? (
            <div className="space-y-8 animate-fade-in">
              <p className="text-neutral-400 text-center text-sm font-bold">يرجى اختيار هوية المستخدم للمتابعة</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedRole('driver')}
                  className="flex-1 p-8 rounded-3xl border border-white/5 bg-white/5 hover:bg-primary-500/10 hover:border-primary-500/30 transition-all flex flex-col items-center gap-4 group"
                >
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-xl group-hover:shadow-primary-500/20">
                    <User className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-black text-neutral-300 uppercase tracking-widest group-hover:text-white">كابتن (سائق)</span>
                </button>
                <button
                  onClick={() => setSelectedRole('market_owner')}
                  className="flex-1 p-8 rounded-3xl border border-white/5 bg-white/5 hover:bg-orange-500/10 hover:border-orange-500/30 transition-all flex flex-col items-center gap-4 group"
                >
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-xl group-hover:shadow-orange-500/20">
                    <Store className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-black text-neutral-300 uppercase tracking-widest group-hover:text-white">تاجر (متجر)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 pt-2 animate-slide-up">
              {/* Active Role Identifier */}
              <div className="flex items-center gap-4 bg-white/5 p-5 rounded-3xl border border-white/5 backdrop-blur-xl">
                <div className={clsx(
                  "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-500",
                  selectedRole === 'driver' ? "bg-primary-500 shadow-primary-500/30" : "bg-orange-500 shadow-orange-500/30"
                )}>
                  {selectedRole === 'driver' ? <User size={28} /> : <Store size={28} />}
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-0.5">تسجيل الدخول كـ</p>
                  <p className="text-base font-extrabold text-white">{selectedRole === 'driver' ? 'كابتن (سائق)' : 'صاحب متجر'}</p>
                </div>
                <button
                  onClick={() => { setSelectedRole(null); setUsername(''); setPassword(''); setInputErrors({ username: false, password: false }); }}
                  className="mr-auto text-[10px] font-black text-neutral-500 hover:text-white uppercase transition-colors pt-1"
                >
                  تغيير
                </button>
              </div>

              {/* Input Fields */}
              <div className={clsx("space-y-4", shakeTrigger && "animate-shake")}>
                <div className="relative group">
                  <User className={clsx(
                    "absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors",
                    inputErrors.username ? "text-red-500" : "text-neutral-500 group-focus-within:text-primary-500"
                  )} />
                  <input
                    type="text"
                    placeholder="اسم المستخدم"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); handleInputFocus('username'); }}
                    className={clsx(
                      "w-full bg-white/5 border rounded-2xl pl-14 pr-6 py-5 text-white font-bold outline-none transition-all text-right",
                      inputErrors.username ? "border-red-700/60 bg-red-500/5" : "border-white/5 focus:border-primary-500 focus:bg-white/10"
                    )}
                  />
                </div>
                <div className="relative group">
                  <Lock className={clsx(
                    "absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors",
                    inputErrors.password ? "text-red-500" : "text-neutral-500 group-focus-within:text-primary-500"
                  )} />
                  <input
                    type="password"
                    placeholder="كلمة المرور"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); handleInputFocus('password'); }}
                    className={clsx(
                      "w-full bg-white/5 border rounded-2xl pl-14 pr-6 py-5 text-white font-bold outline-none transition-all text-right",
                      inputErrors.password ? "border-red-700/60 bg-red-500/5" : "border-white/5 focus:border-primary-500 focus:bg-white/10"
                    )}
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleLogin}
                disabled={!isFormFilled || isLoading}
                className={clsx(
                  "w-full py-5 text-lg font-black mt-4 shadow-2xl rounded-2xl transition-all relative overflow-hidden flex items-center justify-center",
                  !isFormFilled || isLoading ? "bg-white/10 text-white/30 cursor-not-allowed opacity-50" : (selectedRole === 'driver' ? "btn-primary" : "bg-orange-600 hover:bg-orange-500 text-white active:scale-[0.98]")
                )}
              >
                {isLoading ? (
                  <div className="loader-spinner"></div>
                ) : (
                  'دخول للنظام'
                )}
              </button>

              <p className="text-[10px] text-neutral-600 text-center font-bold pt-4 uppercase tracking-[0.2em]">
                بوابة السحابة الآمنة 4.3.0
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
