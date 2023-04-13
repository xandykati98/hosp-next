import { useUser, User } from '@supabase/auth-helpers-react'
import { api } from '~/utils/api'
import AuthContext from './auth_context'
import Login from '~/pages/login'

const Overseer = (props:any) => {
    const user = useUser() as User
    const { data, isLoading } = api.user.getUserData.useQuery({ id: user?.id || '' })
    if (!user) {
        return <Login/>
    }
    if (isLoading) {
        return <div>loading</div>
    }
    if (user && !data?.empresa) {
        return <>tem usuario, nn tem empresa<button onClick={() => props.supabaseClient.auth.signOut()}>sair</button></>
    }
    return <>
        <AuthContext.Provider value={{ ...user, ...data }}>
            {props.children}
        </AuthContext.Provider>
    </>
}

export default Overseer;
