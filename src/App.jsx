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

  const handleLogin = () => {
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

    // Mock Authentication Logic
    const isValid = (selectedRole === 'driver' && username === 'driver' && password === '1234') ||
      (selectedRole === 'market_owner' && username === 'market' && password === '0000');

    if (isValid) {
      login(username, selectedRole);
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2874&auto=format&fit=crop')] bg-cover bg-center opacity-20 blur-sm"></div>

      <div className="z-10 w-full max-w-sm space-y-8 animate-slide-up">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">توتو ديليفري</h1>
          <p className="text-neutral-400 font-bold italic">دخول النظام الآمن</p>
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
                {selectedRole === 'driver' ? 'تجريبي: driver / 1234' : 'تجريبي: market / 0000'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white font-black">جاري التحميل...</div>;

  if (!user) return <LoginScreen />;

  if (user.role === 'market_owner') {
    return <MarketDashboard />;
  }

  // Default to Driver for any other role or 'driver'
  return <DriverHome />;
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
