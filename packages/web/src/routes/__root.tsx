import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/add-coffee" className="[&.active]:font-bold">
          Add Coffee 
        </Link>
        <Link to="/faq"  className="[&.active]:font-bold">
          FAQ
        </Link>
      </div>
      <hr />
      <Outlet />
    </>
  ),
})
