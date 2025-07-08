'use client';
/*──────────────────────────────────────────────────────────────────────────────
  ARCHIVO:  src/app/meetings/page.js
  OBJETIVO: Página para registrar el “sobre digital” de cada reunión de célula
            – Monto en efectivo  +  monto en transferencia
            – Varios comprobantes (fotos base-64) y captura directa de cámara
            – Persistencia en localStorage  (clave = 'envelopesV2')
            – Límite de almacenamiento controlado con navigator.storage.estimate
            – Código modular: 3 componentes externos:
                 • EnvelopeCard        (resumen)
                 • EnvelopeSidePanel   (detalle lateral)
                 • EnvelopeFormModal   (alta / edición)
            ————————————————————————————————————————————————————————
            Autor      : ChatGPT (agregando todos los comentarios pedidos)
            Última mod : 2025-06-16
──────────────────────────────────────────────────────────────────────────────*/

import { useEffect, useMemo, useState } from 'react';
import EnvelopeCard from '@/components/EnvelopeCard';
import EnvelopeSidePanel from '@/components/EnvelopeSidePanel';
import EnvelopeFormModal from '@/components/EnvelopeFormModal';

const LS_CELLS = 'cellsV2';
const LS_MEMB = 'membersV2';
const loadLS = (k, d = []) => {
    if (typeof window === 'undefined') return d;
    try { return JSON.parse(localStorage.getItem(k)) ?? d; }
    catch { return d; }
};

/*──────────────────────── Config / utilidades básicas ───────────────────────*/
const STORAGE_KEY = 'envelopesV2';
const HOUR_DEFAULT = '20:00';
const isoToday = () => new Date().toISOString().slice(0, 10);
const fmtDate = iso => new Date(iso).toLocaleDateString('es-AR');

/*── Persistencia simple (con control de cuota) ───────────────────────────────*/
const loadEnvelopes = () => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []; }
    catch { return []; }
};

async function hasRoom(str) {
    /* Utiliza StorageManager para estimar espacio restante.
       Dejamos 200 kB de margen para no romper la app repentinamente.          */
    if (!navigator.storage?.estimate) return true;
    const { quota = 5_000_000, usage = 0 } = await navigator.storage.estimate();
    return usage + new Blob([str]).size < quota - 200 * 1024;
}

const save = async data => {
    if (typeof window === 'undefined') return;
    const str = JSON.stringify(data);
    if (await hasRoom(str)) {
        localStorage.setItem(STORAGE_KEY, str);
    } else {
        alert(
            '⚠️ Se superó el límite de almacenamiento local.\n' +
            'Elimina imágenes grandes o reduce la cantidad de comprobantes.'
        );
    }
};

/*─────────────────────────── Componente principal ───────────────────────────*/
export default function MeetingsPage() {
    /* ─ estado global de la página ─ */
    const [envelopes, setEnvelopes] = useState([]);
    const [cells, setCells] = useState([]);  //  ← nuevo
    const [members, setMembers] = useState([]);  //  ← nuevo  // lista de sobres
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState(null); // sobre en el panel
    const [filter, setFilter] = useState('all'); // id célula a filtrar

    /* ─ carga inicial y persistencia ─ */
    useEffect(() => {
        setEnvelopes(loadEnvelopes());
        setCells(loadLS(LS_CELLS));
        setMembers(loadLS(LS_MEMB));
    }, []);
    useEffect(() => { save(envelopes); }, [envelopes]);

    /* ─ CRUD helpers ─ */
    const addEnvelope = env => setEnvelopes(prev => [...prev, env]);

    const deleteEnvelope = id => {
        if (!confirm('¿Borrar este sobre?')) return;
        setEnvelopes(prev => prev.filter(e => e.id !== id));
        if (selected?.id === id) setSelected(null);
    };

    /* ─ filtrado memorizado ─ */
    const visibles = useMemo(
        () => filter === 'all'
            ? envelopes
            : envelopes.filter(e => e.cellId === +filter),
        [envelopes, filter]
    );

    /* ─ vista ─ */
    return (
        <>
            {/* ——— CABECERA ——— */}
            <header className="flex flex-col gap-4 md:flex-row md:items-end mb-6">
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white">Sobres digitales</h1>
                    <p className="text-white/80 text-sm">
                        Registra asistencia y ofrendas (efectivo y transferencia).
                    </p>
                </div>

                {/* selector de célula */}
                <select
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    className="border rounded px-3 py-1 text-sm"
                >
                    <option value="all">— Todas las células —</option>
                    {cells.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>

                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Nuevo sobre
                </button>
            </header>

            {/* ——— LISTADO ——— */}
            {visibles.length === 0 && (
                <p className="text-white/80 text-sm">
                    Aún no hay sobres registrados para este filtro.
                </p>
            )}

            {visibles.map(env => (
                <EnvelopeCard
                    key={env.id}
                    env={env}
                    cells={cells}
                    onView={() => setSelected(env)}
                    onDelete={() => deleteEnvelope(env.id)}
                />
            ))}

            {/* ——— MODAL (crear / editar) ——— */}
            {showModal && (
                <EnvelopeFormModal
                    onClose={() => setShowModal(false)}
                    onSave={addEnvelope}
                    /* pasamos datos de referencia  */
                    cells={cells}
                    members={members}
                /* initial → undefined para “crear” */
                />
            )}

            {/* ——— PANEL LATERAL ——— */}
            {selected && (
                <EnvelopeSidePanel
                    env={selected}
                    cells={cells}
                    members={members}
                    onClose={() => setSelected(null)}
                />
            )}
        </>
    );
}

/*─────────────────────────── Export utilitario (opcional) ───────────────────
   Si necesitas la fecha formateada en otro punto de la app puedes hacer:
     import { fmtDate } from '@/app/meetings/page';
──────────────────────────────────────────────────────────────────────────────*/
export { fmtDate, isoToday, HOUR_DEFAULT };
