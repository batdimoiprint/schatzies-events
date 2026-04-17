import { NavLink } from 'react-router-dom';
import { Users } from 'lucide-react';

const navItems = [{ to: '/admin/users', label: 'Users', icon: Users }];

export default function AdminSidebar() {
  return (
    <nav className="flex flex-col gap-2 p-4">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`
          }
        >
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
