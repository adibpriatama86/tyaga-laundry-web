import { LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

export function NoAccessPage() {
  const { signOut } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-lg">
        <EmptyState
          icon={<ShieldAlert className="h-7 w-7" />}
          title="Belum Ada Akses"
          description="Akun Anda belum memiliki akses ke dashboard Tyaga Laundry. Silakan hubungi admin."
          action={
            <Button type="button" variant="secondary" onClick={() => void signOut()}>
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          }
        />
      </div>
    </div>
  );
}
