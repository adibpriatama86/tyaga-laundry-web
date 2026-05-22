import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { useBusinessAccess } from '../hooks/useBusinessAccess';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';

const loginSchema = z.object({
  email: z.string().email('Email tidak valid.'),
  password: z.string().min(6, 'Password minimal 6 karakter.'),
  fullName: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp, user, envError } = useAuth();
  const access = useBusinessAccess();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const isSignUp = mode === 'signup';
  const AuthIcon = isSignUp ? UserPlus : LogIn;
  const authTitle = isSignUp ? 'Buat Akun' : 'Masuk';
  const authCopy = isSignUp
    ? 'Daftarkan akun untuk mengakses dashboard Tyaga Laundry.'
    : 'Masuk menggunakan akun yang sudah memiliki akses.';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', fullName: '' },
  });

  useEffect(() => {
    if (!user || access.isLoading) return;
    navigate(access.hasAccess ? '/dashboard' : '/no-access', { replace: true });
  }, [access.hasAccess, access.isLoading, navigate, user]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError('');
    try {
      if (mode === 'signup') {
        await signUp(values.email, values.password, values.fullName);
        showToast('Akun berhasil dibuat. Jika belum memiliki akses, silakan hubungi admin Tyaga Laundry.', 'success');
        setMode('login');
        setShowPassword(false);
        return;
      }

      await signIn(values.email, values.password);
      await queryClient.invalidateQueries({ queryKey: ['business-access'] });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login gagal. Cek email dan password.';
      setFormError(message.includes('Invalid login credentials') ? 'Email atau password tidak sesuai.' : message);
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img
            src="/logo-tyaga-horizontal.png"
            alt="Tyaga Laundry"
            className="mx-auto h-28 w-auto max-w-[280px] object-contain sm:h-32 sm:max-w-[340px]"
          />
        </div>

        <Card animated className="p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <AuthIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink">{authTitle}</h2>
              <p className="text-sm text-muted">{authCopy}</p>
            </div>
          </div>

          {envError ? <div className="mb-4 rounded-lg bg-amber-50 p-3 text-sm font-medium text-amber-800">{envError}</div> : null}
          {formError ? <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{formError}</div> : null}

          <form onSubmit={(event) => void onSubmit(event)} className="space-y-4">
            {mode === 'signup' ? (
              <Input label="Nama lengkap" placeholder="Opsional" error={errors.fullName?.message} {...register('fullName')} />
            ) : null}
            <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              error={errors.password?.message}
              rightElement={
                <button
                  type="button"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition hover:text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              }
              {...register('password')}
            />
            <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
              {mode === 'login' ? 'Masuk' : 'Buat Akun'}
            </Button>
          </form>

          <button
            type="button"
            className="mt-5 w-full text-center text-sm font-semibold text-primary hover:text-blue-700"
            onClick={() => {
              setFormError('');
              setShowPassword(false);
              setMode(isSignUp ? 'login' : 'signup');
            }}
          >
            {isSignUp ? 'Sudah punya akun? Masuk' : 'Buat akun'}
          </button>
        </Card>
      </div>
    </div>
  );
}