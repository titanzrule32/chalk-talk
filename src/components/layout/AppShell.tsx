import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';

export function AppShell() {
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
