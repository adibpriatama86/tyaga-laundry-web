import { NavLink, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { mobileNavigation, moreNavigation } from '../../config/navigation';
import { cn } from '../../utils/cn';

interface BottomNavProps {
  onMore: () => void;
}

export function BottomNav({ onMore }: BottomNavProps) {
  const location = useLocation();
  const moreActive = moreNavigation.some((item) => location.pathname === item.path);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-2 pb-2 pt-1 backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
        {mobileNavigation.map((item) => (
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
                'flex h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-semibold transition',
                isActive ? 'bg-primary-soft text-primary' : 'text-muted hover:bg-slate-50',
              );
            }}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={onMore}
          className={cn(
            'flex h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-semibold transition hover:bg-slate-50',
            moreActive ? 'bg-primary-soft text-primary' : 'text-muted',
          )}
        >
          <Menu className="h-5 w-5" />
          Lainnya
        </button>
      </div>
    </nav>
  );
}
