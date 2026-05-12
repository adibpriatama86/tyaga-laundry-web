import { NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { mobileNavigation } from '../../config/navigation';
import { cn } from '../../utils/cn';

interface BottomNavProps {
  onMore: () => void;
}

export function BottomNav({ onMore }: BottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-2 pb-2 pt-1 backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
        {mobileNavigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-semibold transition',
                isActive ? 'bg-primary-soft text-primary' : 'text-muted hover:bg-slate-50',
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={onMore}
          className="flex h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-semibold text-muted transition hover:bg-slate-50"
        >
          <Menu className="h-5 w-5" />
          Lainnya
        </button>
      </div>
    </nav>
  );
}
