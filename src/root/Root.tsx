import { Outlet, useLocation } from 'react-router-dom';

import App from '@/App';

export default function Root() {
  const location = useLocation();

  const isLogin = localStorage.getItem('isLogin');

  if (!isLogin) {
    return (window.location.href = '/login');
  }

  return (
    <div className="w-full ">
      {/* <Header /> */}
      <div className="flex ">
        {/* <Sidebar /> */}
        <div className="w-full px-2">
          {location.pathname === '/' ? <App /> : <Outlet />}
        </div>
      </div>
    </div>
  );
}
