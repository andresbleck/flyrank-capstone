import ContactForm from './components/ContactForm'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <main className="mx-auto w-full max-w-lg">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Hablemos</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Cuéntame en qué estás trabajando y te respondo en menos de 24 horas.
          </p>
        </header>

        <ContactForm />
      </main>
    </div>
  )
}
