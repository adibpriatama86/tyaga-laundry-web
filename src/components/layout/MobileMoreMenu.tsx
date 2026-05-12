import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { moreNavigation } from '../../config/navigation';
import { useAuth } from '../../hooks/useAuth';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface MobileMoreMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMoreMenu({ open, onClose }: MobileMoreMenuProps) {
  const { signOut } = useAuth();

  return (
    <Modal open={open} title="Menu Lainnya" onClose={onClose} className="sm:max-w-md">
      <div className="grid gap-2">
        {moreNavigation.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg border border-line px-3 py-3 text-sm font-semibold text-ink transition hover:bg-slate-50"
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
