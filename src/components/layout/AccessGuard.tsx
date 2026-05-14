import { Navigate } from 'react-router-dom';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useBusinessAccess } from '../../hooks/useBusinessAccess';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';

export function AccessGuard({ children }: { children: React.ReactNode }) {
  const { hasAccess, isLoading, isError } = useBusinessAccess();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas text-primary">
        <Loader2 className="h-7 w-7 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
        <div className="w-full max-w-lg">
          <EmptyState
            title="Akses gagal diperiksa"
            description="Data akses dashboard belum bisa diverifikasi. Coba refresh halaman atau login ulang."
            icon={<RefreshCcw className="h-7 w-7" />}
            action={
              <Button type="button" variant="secondary" onClick={() => window.location.reload()}>
                Refresh
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return <Navigate to="/no-access" replace />;
  }

  return <>{children}</>;
}
