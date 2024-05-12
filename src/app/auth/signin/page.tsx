import { signIn } from '~/auth'
import { LoginForm } from './form'

function SignIn() {
  return (
    <main className="w-full lg:w-[768px] mx-auto flex justify-center px-6 py-12 lg:py-24">
      <form
        action={async formData => {
          'use server'
          await signIn('credentials', formData)
        }}
      >
        <LoginForm />
      </form>
    </main>
  )
}

export default SignIn
