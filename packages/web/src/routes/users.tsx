import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/network/user';
export const Route = createFileRoute('/users')({
  component: () => {

    const { isPending: usersPending, error: usersError, data: usersData } = useQuery({
      queryKey: ['usersData'],
      queryFn: () => getUsers(),
    })

    if (usersPending) return <div>Loading...</div>
    if (usersError) return <div>Error: {usersError.message}</div>

    return (
      <div>
        {
          usersData?.map((user: any) => {
            return (
              <div key={user.id} className="p-2 border-b flex gap-4 items-center">
                <div>{user.name}</div>
                <input type="checkbox"
                  onChange={() => { }}
                  checked={user.admin}
                />
              </div>
            )
          })
        }
      </div>
    )
  }
})