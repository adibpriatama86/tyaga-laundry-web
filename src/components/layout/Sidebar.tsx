import { NavLink, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { desktopNavigation } from '../../config/navigation';
import { useAuth } from '../../hooks/useAuth';
import { useBusinessAccess } from '../../hooks/useBusinessAccess';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

export function Sidebar() {
  const { signOut } = useAuth();
  const { business } = useBusinessAccess();
  const location = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-line bg-white px-4 py-5 lg:flex lg:flex-col">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
          <img src="/icon-tyaga.png" alt="Tyaga Laundry" className="h-9 w-9 object-contain" />
        </div>
        <div>
          <p className="text-base font-bold text-ink">Tyaga Laundry</p>
          <p className="text-xs text-muted">{business?.owner_name || 'Ibu Yuli'}</p>
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {desktopNavigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={() => {
              const isActive =
                item.path === '/dashboard'
                  ? location.pathname === '/' || location.pathname === '/dashboard'
                  : location.pathname === item.path;

              return cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition',
                isActive ? 'bg-primary-soft text-primary' : 'text-muted hover:bg-slate-50 hover:text-ink',
              );
            }}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <Button type="button" variant="ghost" className="justify-start" onClick={() => void signOut()}>
        <LogOut className="h-5 w-5" />
        Logout
      </Button>
    </aside>
  );
}
