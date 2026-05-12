import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-lg">
        <EmptyState
          title="Halaman tidak ditemukan"
          description="Alamat yang dibuka tidak tersedia di aplikasi Tyaga Laundry."
          action={
            <Link to="/dashboard">
              <Button>Kembali ke Dashboard</Button>
            </Link>
          }
        />
      </div>
    </div>
  );
}
