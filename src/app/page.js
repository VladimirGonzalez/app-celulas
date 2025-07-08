/*  Página principal — Panel de control
    Lee los datos de un archivo JSON local (db.json)
    y muestra los totales de células y miembros.
    ———————————————————————————————————————————— */

import data from '../data/db.json';     // ← ruta relativa al JSON

export const dynamic = 'force-static';  // Next lo trata como estático

export default function Home() {
  const totalCells    = data.cells.length;
  const totalMembers  = data.members.length;

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Panel de Control</h1>
      <p className="mb-6">Bienvenido al sistema de gestión de células.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ——— Células ——— */}
        <div className="card">
          <p className="text-sm text-gray-500">Total de células</p>
          <p className="text-2xl font-semibold">{totalCells}</p>
        </div>

        {/* ——— Miembros ——— */}
        <div className="card">
          <p className="text-sm text-gray-500">Total de miembros</p>
          <p className="text-2xl font-semibold">{totalMembers}</p>
        </div>
      </div>
    </>
  );
}
