import AuthForm from "../components/authForm/AuthForm";

const AuthPage: React.FC = () => {

  return (
    <main className="min-h-screen flex items-center justify-center">
      <section className="w-full max-w-md px-4">
        <AuthForm />
      </section>
    </main>
  )
}

export default AuthPage;