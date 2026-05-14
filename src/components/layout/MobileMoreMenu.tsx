import { Link, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { moreNavigation } from '../../config/navigation';
import { useAuth } from '../../hooks/useAuth';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

interface MobileMoreMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMoreMenu({ open, onClose }: MobileMoreMenuProps) {
  const { signOut } = useAuth();
  const location = useLocation();

  return (
    <Modal open={open} title="Menu Lainnya" onClose={onClose} className="sm:max-w-md">
      <div className="grid gap-2">
        {moreNavigation.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 rounded-lg border px-3 py-3 text-sm font-semibold transition',
              location.pathname === item.path
                ? 'border-primary bg-primary-soft text-primary'
                : 'border-line text-ink hover:bg-slate-50',
            )}
          >
            <item.icon className="h-5 w-5 text-primary" />
            {item.label}
          </Link>
        ))}
        <Button
          type="button"
          variant="secondary"
          className="mt-2 justify-start"
          onClick={() => {
            onClose();
            void signOut();
          }}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </Modal>
  );
}
