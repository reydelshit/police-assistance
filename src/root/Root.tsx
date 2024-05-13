import { Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

import App from '@/App';
import { useEffect, useState } from 'react';

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

  const [idle, setIdle] = useState(false);

  const timeout = 10000;

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const resetIdleTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIdle(true);
        handleLogout();
      }, timeout);
    };

    const handleUserActivity = () => {
      if (idle) {
        setIdle(false);
      }
      resetIdleTimer();
    };

    resetIdleTimer();

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('mousedown', handleUserActivity);
    window.addEventListener('keypress', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('mousedown', handleUserActivity);
      window.removeEventListener('keypress', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
    };
  }, [timeout, idle, handleLogout]);

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
