import { asset } from "@/lib/site";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-foam px-6 text-center">
      <Logo className="h-10" />
      <h1 className="text-3xl font-extrabold text-ink-900">Esta página no existe</h1>
      <p className="max-w-md text-ink-900/65">Puede que el enlace esté mal escrito. Volvé al inicio o registrate para recibir agua en tu casa.</p>
      <div className="flex gap-3">
        <a href={asset("/")} className="btn-ghost-dark">
          Ir al inicio
        </a>
        <a href={asset("/registro/")} className="btn-primary">
          Quiero agua en casa
        </a>
      </div>
    </main>
  );
}
