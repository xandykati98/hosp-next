import { useUser, useSupabaseClient, User } from '@supabase/auth-helpers-react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import styles from './index.module.css'
import { api } from '~/utils/api'
import { useContext } from 'react'
import AuthContext from '~/components/auth_context'

const App = () => {
  const supabaseClient = useSupabaseClient()
  const user = useContext(AuthContext) as User
  return <main>hi
  </main>
}

export default App;
