import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'App Células',
  description: 'MVP · Gestión celular',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <main className="container pb-16">{children}</main>

        {/* —— Tab bar —— */}
        <nav className="nav-bottom md:hidden">
          {[
            ['/',        '🏠', 'Inicio'],
            ['/cells',   '👥', 'Células'],
            ['/members', '🙋', 'Miembros'],
            ['/meetings','📅', 'Reuniones'],
            ['/offerings','💰','Ofrendas'],
          ].map(([href, icon, label]) => (
            <Link key={href} href={href}
                  className={`nav-link ${href === '/' ? 'nav-active' : ''}`}>
              <span className="block text-lg leading-none">{icon}</span>{label}
            </Link>
          ))}
        </nav>
      </body>
    </html>
  );
}
