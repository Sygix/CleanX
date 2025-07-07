import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import bg from '../assets/images/w11.png'

export const Route = createRootRoute({
  component: () => (
    <main className='text-carbon-900 relative flex min-h-screen flex-col'>
      <img src={bg} alt="background image" className='h-full w-full absolute -z-50 max-h-full object-cover'/>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <Outlet />
      <TanStackRouterDevtools />
    </main>
  ),
})