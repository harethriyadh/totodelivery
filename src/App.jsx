
import React from 'react';
import DriverHome from './pages/driver/DriverHome';
import MarketDashboard from './pages/market/MarketDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { User, Store } from 'lucide-react';

const LoginScreen = () => {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2874&auto=format&fit=crop')] bg-cover bg-center opacity-20 blur-sm"></div>

      <div className="z-10 w-full max-w-sm space-y-8 animate-slide-up">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">توتو ديليفري</h1>
          <p className="text-neutral-400 font-bold">منصة التوصيل المتكاملة</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => login('driver')}
            className="w-full bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-[32px] flex items-center gap-6 hover:bg-white/20 transition-all group text-right"
          >
            <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">تسجيل كسائق</h3>
              <p className="text-xs text-neutral-300 font-bold mt-1">ابدأ استلام الطلبات</p>
            </div>
          </button>

          <button
            onClick={() => login('market_owner')}
            className="w-full bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-[32px] flex items-center gap-6 hover:bg-white/20 transition-all group text-right"
          >
            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <Store className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">صاحب متجر</h3>
              <p className="text-xs text-neutral-300 font-bold mt-1">إدارة الطلبات والمخزون</p>
            </div>
          </button>
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
