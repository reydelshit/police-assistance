import { Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

import App from '@/App';

export default function Root() {
  const location = useLocation();

  // const isLogin = localStorage.getItem('isLogin');

  // if (!isLogin) {
  //   return (window.location.href = '/login');
  // }

  const handleLogout = () => {
    localStorage.removeItem('police_reauth');
    localStorage.removeItem('police_token');

    window.location.href = '/login';
  };

  return (
    <div className="w-full ">
      {/* <Header /> */}
      <div className="flex ">
        {/* <Sidebar /> */}
        <div className="w-full px-2">
          {location.pathname === '/' ? <App /> : <Outlet />}
        </div>
      </div>
      {location.pathname !== '/' && (
        <Button onClick={handleLogout} className="absolute bottom-4 left-4">
          Logout
        </Button>
      )}
    </div>
  );
}
