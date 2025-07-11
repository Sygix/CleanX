import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import bg from '../assets/images/w11.png';
import Menu from '../components/layout/Menu';
import LatestEvents from '../components/LatestEvents';
import DiskGauge from '../components/DiskGauge';

export const Route = createRootRoute({
  loader: () => void 0,
  component: () => (
    <main className="text-carbon-800 relative inset-0 h-screen min-h-screen">
      <img
        src={bg}
        alt="background image"
        className="absolute -z-50 h-full max-h-full w-full object-cover"
      />
      <div className="flex h-full gap-6 overflow-y-scroll p-6">
        <div className="h-full w-72 shrink-0 rounded-lg bg-white/60 backdrop-blur-3xl">
          <Menu />
        </div>
        <div className="h-full min-w-xl grow rounded-lg bg-white/60 backdrop-blur-3xl">
          <Outlet />
        </div>
        <div className="flex h-full w-72 shrink-0 flex-col gap-6">
          <DiskGauge />
          <LatestEvents />
        </div>
      </div>
      <TanStackRouterDevtools />
    </main>
  ),
});
