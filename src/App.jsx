import React, { useState } from 'react';
import DriverHome from './pages/driver/DriverHome';
import MarketDashboard from './pages/market/MarketDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { User, Store } from 'lucide-react';
import { clsx } from 'clsx';

const LoginScreen = () => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!selectedRole) {
      setError('يرجى اختيار نوع الحساب');
      return;
    }

    // Mock Authentication Logic
    const isValid = (selectedRole === 'driver' && password === '1234') ||
      (selectedRole === 'market_owner' && password === '0000');

    if (isValid) {
      login(selectedRole);
    } else {
      setError('كلمة المرور غير صحيحة');
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
          <div className="flex gap-3">
            <button
              onClick={() => { setSelectedRole('driver'); setError(''); }}
              className={clsx(
                "flex-1 p-4 rounded-2xl border transition-all flex flex-col items-center gap-2",
                selectedRole === 'driver' ? "bg-primary-500 border-primary-400 text-white shadow-lg" : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10"
              )}
            >
              <User className="w-8 h-8" />
              <span className="text-xs font-black">كابتن</span>
            </button>
            <button
              onClick={() => { setSelectedRole('market_owner'); setError(''); }}
              className={clsx(
                "flex-1 p-4 rounded-2xl border transition-all flex flex-col items-center gap-2",
                selectedRole === 'market_owner' ? "bg-orange-500 border-orange-400 text-white shadow-lg" : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10"
              )}
            >
              <Store className="w-8 h-8" />
              <span className="text-xs font-black">صاحب متجر</span>
            </button>
          </div>

          <div className="space-y-4 pt-4">
            <input
              type="password"
              placeholder="كلمة المرور (تجريبي)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-primary-500 focus:bg-white/10 transition-all text-center tracking-widest"
            />
            {error && <p className="text-red-400 text-[10px] font-bold text-center animate-pulse">{error}</p>}
            <button
              onClick={handleLogin}
              className="btn-primary w-full py-5 text-lg font-black mt-4 shadow-2xl"
            >
              دخول
            </button>
          </div>
          <p className="text-[10px] text-neutral-500 text-center font-bold">Driver: 1234 | Market: 0000</p>
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
