'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // If we're already on the login page, no need to check auth redirect
    if (pathname === '/login') {
      setIsAuthenticated(true);
      return;
    }

    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem('aakritee_auth');
      if (!authData) {
        setIsAuthenticated(false);
        router.push('/login');
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [pathname, router]);

  // While checking authentication state, render a clean loading screen
  if (isAuthenticated === null && pathname !== '/login') {
    return (
      <div className="auth-loading-screen">
        <div className="loading-spinner font-heading">
          <img src="/AakriteeLogo.png" alt="Aakritee Logo" width={48} height={48} />
          <span>Verifying Security Access...</span>
        </div>
        <style jsx>{`
          .auth-loading-screen {
            min-height: 100vh;
            width: 100vw;
            background-color: #070a16;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FED602;
          }
          .loading-spinner {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            font-size: 14px;
            font-weight: 700;
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}
