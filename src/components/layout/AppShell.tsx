import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { MuteButton } from '../shared/MuteButton';

export function AppShell() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="fixed right-3 top-3 z-50">
        <MuteButton />
      </div>
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
