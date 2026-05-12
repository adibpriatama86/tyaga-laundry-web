import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { LockKeyhole, Sparkles } from 'lucide-react';
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
  const { signIn, signUp, user, envError } = useAuth();
  const access = useBusinessAccess();
  const navigate = useNavigate();
  const { showToast } = useToast();

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
        showToast('Akun berhasil dibuat. Jika belum memiliki akses, hubungi admin untuk ditambahkan ke dashboard Tyaga Laundry.', 'success');
        setMode('login');
        return;
      }

      await signIn(values.email, values.password);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login gagal. Cek email dan password.';
      setFormError(message.includes('Invalid login credentials') ? 'Email atau password tidak sesuai.' : message);
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-soft">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-ink">Tyaga Laundry</h1>
        </div>

        <Card animated className="p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink">{mode === 'login' ? 'Masuk' : 'Sign Up Demo/Dev'}</h2>
              <p className="text-sm text-muted">Gunakan email dan password Supabase Auth.</p>
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
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              error={errors.password?.message}
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
              setMode(mode === 'login' ? 'signup' : 'login');
            }}
          >
            {mode === 'login' ? 'Buat akun demo/dev' : 'Sudah punya akun? Masuk'}
          </button>
        </Card>
      </div>
    </div>
  );
}
