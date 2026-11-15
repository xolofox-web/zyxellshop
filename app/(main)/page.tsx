import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Sparkles, Bell, User, LayoutGrid } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let greeting = "Selamat datang";
  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("full_name, username")
      .eq("id", user.id)
      .single();
    if (profile?.full_name) greeting = `Halo, ${profile.full_name.split(" ")[0]}`;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="space-y-2">
        <p className="text-sm text-[var(--muted)]">{greeting} 👋</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          ZYXELL<span className="text-brand-purple">.</span>
        </h1>
        <p className="max-w-lg text-sm text-[var(--muted)]">
          Platform katalog modern dengan pengalaman pengguna yang bersih dan
          elegan. Temukan koleksi pilihan dalam antarmuka yang minimalis.
        </p>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-gradient-to-br from-brand-purple/5 to-brand-pink/5 p-6 shadow-soft">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 text-brand-purple" />
          <div>
            <h2 className="font-semibold">Pengumuman</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Selamat datang di ZYXELL. Jelajahi katalog dan atur profil Anda.
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { href: "/catalog", label: "Katalog", icon: LayoutGrid },
          { href: "/notifications", label: "Notifikasi", icon: Bell },
          { href: "/cart", label: "Keranjang", icon: ShoppingCartIcon },
          { href: "/profile", label: "Profil", icon: User },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-2 rounded-2xl border border-[var(--border)] p-4 transition-all hover:shadow-soft hover:-translate-y-0.5"
            >
              <Icon className="h-6 w-6 text-brand-purple" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}

function ShoppingCartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}