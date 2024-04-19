import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";


export const Route = createRootRoute({
  component: () => {


    const { isAuthenticated, login, logout } = useKindeAuth();

    return (
      <>

        {
          isAuthenticated ? (
            <>
              <div className='flex justify-between px-3'>
                <div className="p-2 flex gap-2">
                  <Link to="/" className="[&.active]:font-bold">
                    Home
                  </Link>{' '}
                  <Link to="/add-coffee" className="[&.active]:font-bold">
                    Add Coffee
                  </Link>
                  <Link to="/faq" className="[&.active]:font-bold">
                    FAQ
                  </Link>
                </div>

                <div className='p-2 flex gap-2'>
                  <Link to="/cart" className="[&.active]:font-bold">
                    Cart
                  </Link>

                  <button onClick={() => {
                    logout();
                  }} type="button">
                    Sign Out
                  </button>
                </div>
              </div>
              <hr />
              <Outlet />
            </>
          )
            : <div className='flex flex-col w-100 h-100 justify-center items-center'>
              <h2>
                Welcome to the Bean Store!!
              </h2>

              <button onClick={() => {
                login();
              }} type="button">
                Sign In
              </button>
            </div>
        }
      </>
    )
  }
})
