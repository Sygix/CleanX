import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import bg from '../assets/images/w11.png'
import Menu from '../components/layout/Menu'

export const Route = createRootRoute({
  component: () => (
    <main className='text-carbon-800 relative min-h-screen h-screen inset-0'>
      <img src={bg} alt="background image" className='h-full w-full absolute -z-50 max-h-full object-cover'/>
      <div className="flex p-6 gap-6 h-full overflow-y-scroll">
        <div className='bg-white/60 backdrop-blur-3xl rounded-lg h-full w-80 shrink-0'><Menu/></div>
        <div className='bg-white/60 backdrop-blur-3xl rounded-lg h-full min-w-xl grow'><Outlet /></div>
        <div className='bg-white/60 backdrop-blur-3xl rounded-lg h-full w-80 shrink-0'>test</div>
      </div>
      <TanStackRouterDevtools />
    </main>
  ),
})