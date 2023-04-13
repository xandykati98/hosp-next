import { useUser, User } from '@supabase/auth-helpers-react'
import { api } from '~/utils/api'
import AuthContext from './auth_context'
import Login from '~/pages/login'
import Header from './header'

const Overseer = (props:any) => {
    return <div>
        <Header/>
        {props.children}
    </div>

    // this is for authentication and authorization
    const user = useUser() as User
    const { data, isLoading } = api.user.getUserData.useQuery({ id: user?.id || '' })
    if (isLoading) {
        return <div>loading</div>
    }
    if (!user) {
        return <Login/>
    }
    return <>
        <AuthContext.Provider value={{ ...user, ...data }}>
            {props.children}
        </AuthContext.Provider>
    </>
}

export default Overseer;
