'use client';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold">Grow Analytics</h1>
      <nav className="space-x-4">
        <ul className='flex flex-row justify-between items-center gap-8'>
          <li>
            <a className="hover:underline" href='/'>BASICO</a>
          </li>
          <li>
            <a className="hover:underline" href='/users'>EXTRA</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;