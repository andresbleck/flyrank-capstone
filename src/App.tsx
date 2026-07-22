import { ContactForm } from './features/contact/ContactForm'

export function App() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <ContactForm />
      </div>
    </main>
  )
}
