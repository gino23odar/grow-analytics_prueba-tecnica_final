'use client';

import { useRouter } from 'next/navigation';
import { logout } from '@/utils/auth';

const Header = () => {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login'); // Redirect to login page after logout
  };

  return (
    <header className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold">Grow Analytics</h1>
      <nav className="space-x-4">
        <ul className='flex flex-row justify-between items-center gap-8'>
          <li>
            <a className="hover:underline" href='/users'>BASICO</a>
          </li>
          <li>
            <a className="hover:underline" href='/admin'>EXTRA</a>
          </li>
          <li>
            <button onClick={handleLogout} className="hover:underline">
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;