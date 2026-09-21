import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DatabaseService } from '../services/db';
import { AppConfig, UserProfile } from '../types';
import { INITIAL_APP_CONFIG } from '../services/seedData';
import { AppLogo } from '../components/AppLogo';
import { isFirebaseConfigured } from '../lib/firebase';
import {
  Lock,
  User,
  Mail,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  KeyRound,
  CheckCircle2,
  HelpCircle,
  Flame
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle, loginWithEmail, loginStudentWithNIS, quickLogin } = useAuth();

  const [activeTab, setActiveTab] = useState<'guru' | 'murid'>('guru');
  const [email, setEmail] = useState('guru@pjok.sch.id');
  const [password, setPassword] = useState('guru123');

  const [studentIdentity, setStudentIdentity] = useState('1001');
  const [studentPassword, setStudentPassword] = useState('123456');

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [config, setConfig] = useState<AppConfig>(INITIAL_APP_CONFIG);
  const [demoUsers, setDemoUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    DatabaseService.getAppConfig().then(setConfig);
    DatabaseService.getUsers().then((users) => {
      setDemoUsers(users.slice(0, 4));
    });
  }, []);

  // Handle Firebase Google Sign-In
  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccessMsg(null);
    setGoogleLoading(true);

    const res = await loginWithGoogle();
    setGoogleLoading(false);

    if (!res.success) {
      setError(res.message || 'Gagal masuk dengan Akun Google.');
    } else {
      setSuccessMsg('Autentikasi Firebase berhasil! Memuat dashboard...');
    }
  };

  // Handle Teacher / Email Login via Firebase Auth
  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Silakan masukkan alamat email terdaftar.');
      return;
    }
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    const res = await loginWithEmail(email, password);
    setLoading(false);

    if (!res.success) {
      setError(res.message || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.');
    } else {
      setSuccessMsg('Login berhasil! Mengalihkan ke halaman Guru...');
    }
  };

  // Handle Student NIS Login with verification against 'pengguna' collection
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentIdentity.trim()) {
      setError('Silakan masukkan NIS atau nama lengkap siswa.');
      return;
    }
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    const res = await loginStudentWithNIS(studentIdentity, studentPassword);
    setLoading(false);

    if (!res.success) {
      setError(res.message || 'Gagal masuk. Pastikan NIS atau nama terdaftar di sistem.');
    } else {
      setSuccessMsg('Verifikasi murid berhasil! Mengalihkan ke halaman Penilaian...');
    }
  };

  // Quick Persona selection
  const handleQuickSelect = async (u: UserProfile) => {
    setError(null);
    setSuccessMsg(`Beralih sebagai ${u.nama} (${u.role.toUpperCase()})...`);
    setLoading(true);
    await quickLogin(u.uid);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-blue-50/30 to-indigo-50/40 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Dynamic App Logo */}
        <div className="flex justify-center mb-3">
          <AppLogo size="xl" showText={false} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
          {config.appName || 'PENILAIAN ANTAR TEMAN PJOK'}
        </h1>
        <p className="mt-1 text-sm font-semibold text-blue-600">
          &ldquo;{config.motto || 'Sportif, Jujur, dan Menghargai Gerak Teman'}&rdquo;
        </p>
        <p className="mt-0.5 text-xs text-slate-500">
          {config.schoolName || 'Pendidikan Jasmani, Olahraga, dan Kesehatan'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-5 sm:px-8 rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-100 space-y-5">
          
          {/* Status Badge: Firebase & Firestore 'pengguna' */}
          <div className="flex items-center justify-between px-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-2xl text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5 font-medium">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Firebase Auth & Firestore</span>
            </div>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              koleksi: &apos;pengguna&apos;
            </span>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="leading-snug">
                <strong className="block font-semibold">Gagal Masuk</strong>
                <span>{error}</span>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-800 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Primary Firebase Authentication: Google Sign-In */}
          <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-60"
            >
              {googleLoading ? (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>{googleLoading ? 'Menghubungkan Akun Google...' : 'Masuk dengan Akun Google'}</span>
            </button>
            <p className="mt-1.5 text-[11px] text-center text-slate-500">
              Otentikasi aman Firebase. Peran (&apos;guru&apos; vs &apos;murid&apos;) diperiksa di Firestore.
            </p>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              atau pilih metode login
            </span>
            <div className="border-t border-slate-200 w-full"></div>
          </div>

          {/* Role Navigation Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setActiveTab('guru');
                setError(null);
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'guru'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Akun Guru (PJOK)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('murid');
                setError(null);
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'murid'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Akun Murid / Siswa</span>
            </button>
          </div>

          {/* TAB 1: GURU LOGIN FORM */}
          {activeTab === 'guru' && (
            <form onSubmit={handleTeacherSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Guru (Firebase Auth)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="guru@pjok.sch.id"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500/25 focus:border-blue-600 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kata Sandi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi guru"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500/25 focus:border-blue-600 transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/30 shadow-md shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Memverifikasi Peran Guru...' : 'MASUK SEBAGAI GURU'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 2: MURID LOGIN FORM */}
          {activeTab === 'murid' && (
            <form onSubmit={handleStudentSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  NIS atau Nama Lengkap Siswa
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={studentIdentity}
                    onChange={(e) => setStudentIdentity(e.target.value)}
                    placeholder="Contoh: 1001 atau Andi Pratama"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kata Sandi Siswa (Standar: 123456)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/30 shadow-md shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Memvalidasi Peran Murid...' : 'MASUK SEBAGAI MURID'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo Persona Testing */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Uji Coba Cepat Peran:
              </span>
              <span className="text-[10px] text-slate-400">Klik untuk langsung masuk</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {demoUsers.map((u) => {
                const isGuru = u.role === 'guru';
                return (
                  <button
                    key={u.uid}
                    type="button"
                    onClick={() => handleQuickSelect(u)}
                    disabled={loading}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      isGuru
                        ? 'bg-blue-50/50 hover:bg-blue-100/70 border-blue-200/80 text-blue-900'
                        : 'bg-emerald-50/50 hover:bg-emerald-100/70 border-emerald-200/80 text-emerald-900'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isGuru ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {isGuru ? 'G' : 'M'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold truncate text-[11px]">{u.nama}</p>
                      <p className="text-[10px] opacity-75 truncate">
                        {isGuru ? 'Peran: Guru' : `NIS: ${u.nis || '-'}`}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Credential Reference Guide */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-[11px] space-y-1.5 text-slate-600">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              <span>Panduan Kredensial & Pengecekan Koleksi:</span>
            </div>
            <p className="leading-relaxed">
              &bull; <strong>Peran Guru:</strong> Akses penuh dashboard guru, rekap, rubrik, dan manajemen kelas. Data diverifikasi dengan <code className="bg-white px-1.5 py-0.5 rounded text-blue-700 font-mono font-bold">role: &apos;guru&apos;</code> pada koleksi Firestore <code className="bg-white px-1 py-0.5 rounded text-slate-800 font-mono">&apos;pengguna&apos;</code>.
            </p>
            <p className="leading-relaxed">
              &bull; <strong>Peran Murid:</strong> Akses formulir penilaian antar teman dan riwayat skor. Terverifikasi dengan <code className="bg-white px-1.5 py-0.5 rounded text-emerald-700 font-mono font-bold">role: &apos;murid&apos;</code>.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

