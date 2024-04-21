import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />
                      </svg>

                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#0c0c0c] border-none w-56 px-4">
                      <DropdownMenuLabel>
                        <button onClick={() => {
                          logout();
                        }} type="button">
                          Sign Out
                        </button>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link to="/profile" className="[&.active]:font-bold">
                          <div className='flex gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            <span>
                              Profile
                            </span>
                          </div>

                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
