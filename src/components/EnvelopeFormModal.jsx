'use client';
import { useRef, useState } from 'react';
import { compressImg } from '@/lib/img-helpers';   // → ver nota más abajo

/* —— util local ————————————————————————————— */
const isoHoy = () => new Date().toISOString().slice(0, 10);
const HORA_DEFECTO = '20:00';

/**
 * Modal para crear / editar un sobre
 * @param {Function} onClose()            – cierra modal
 * @param {Function} onSave(envelopeObj)  – guarda
 * @param {Object[]} cells                – lista de células
 * @param {Object[]} members              – lista de miembros
 * @param {Object}   [initial]            – sobre existente (edición)
 */
export default function EnvelopeFormModal({ onClose, onSave, cells, members, initial }) {
  /* — estado — */
  const [cellId,  setCellId ]  = useState(initial?.cellId        ?? cells[0]?.id);
  const [date,    setDate  ]   = useState(initial?.date          ?? isoHoy());
  const [hour,    setHour  ]   = useState(initial?.hour          ?? HORA_DEFECTO);
  const [leader,  setLeader]   = useState(initial?.leader        ?? '');
  const [host,    setHost  ]   = useState(initial?.host          ?? '');
  const [attIds,  setAttIds]   = useState(initial?.attendeesIds  ?? []);
  const [cash,    setCash  ]   = useState(initial?.cashAmount    ?? 0);
  const [transf,  setTransf]   = useState(initial?.transferAmount?? 0);
  const [imgs,    setImgs  ]   = useState(initial?.transferImages?? []);

  /* input oculto para cámara */
  const camInput = useRef();

  /* — helpers — */
  const toggleAtt  = id   => setAttIds(a => a.includes(id) ? a.filter(x => x !== id) : [...a, id]);
  const removeImg  = idx  => setImgs(x => x.filter((_,i) => i !== idx));

  const addFiles = async files => {
    const arr = await Promise.all(
      [...files].map(f => compressImg(f))      // ← redimensiona & comprime
    );
    setImgs(prev => [...prev, ...arr]);
  };

  const submit = e => {
    e.preventDefault();
    onSave({
      id: initial?.id ?? Date.now(),
      cellId: +cellId,
      date, hour, leader, host,
      attendeesIds : attIds,
      cashAmount   : +cash,
      transferAmount: +transf,
      transferImages: imgs,
    });
    onClose();
  };

  /* — vista — */
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form onSubmit={submit}
            className="bg-white w-full max-w-lg p-6 rounded shadow
                       overflow-y-auto max-h-[90vh] flex flex-col gap-4">

        <h2 className="text-lg font-semibold">Nuevo sobre digital</h2>

        {/* célula + fecha */}
        <div className="flex gap-2">
          <label className="flex-1 text-sm">
            Célula
            <select className="border w-full px-2 py-1 rounded mt-1"
                    value={cellId} onChange={e=>setCellId(e.target.value)}>
              {cells.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>

          <label className="flex-1 text-sm">
            Fecha
            <input type="date" className="border w-full px-2 py-1 rounded mt-1"
                   value={date} onChange={e=>setDate(e.target.value)}/>
          </label>
        </div>

        {/* hora / líder / anfitrión */}
        <label className="text-sm">Horario
          <input type="time" className="border w-full px-2 py-1 rounded mt-1"
                 value={hour} onChange={e=>setHour(e.target.value)}/>
        </label>

        <label className="text-sm">Líder
          <input className="border w-full px-2 py-1 rounded mt-1"
                 value={leader} onChange={e=>setLeader(e.target.value)}/>
        </label>

        <label className="text-sm">Anfitrión / Lugar
          <input className="border w-full px-2 py-1 rounded mt-1"
                 value={host} onChange={e=>setHost(e.target.value)}/>
        </label>

        {/* asistencia */}
        <fieldset className="border rounded p-3">
          <legend className="text-sm font-medium">
            Asistentes ({attIds.length})
          </legend>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto mt-2">
            {members.filter(m=>m.cellId===+cellId).map(m=>(
              <label key={m.id} className="flex items-center gap-1 text-xs">
                <input type="checkbox"
                       checked={attIds.includes(m.id)}
                       onChange={()=>toggleAtt(m.id)}/>
                {m.fullName}
              </label>
            ))}
          </div>
        </fieldset>

        {/* montos */}
        <fieldset className="border rounded p-3">
          <legend className="text-sm font-medium">Ofrenda</legend>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <label className="text-sm">Efectivo $
              <input type="number" step="0.01" min="0"
                     className="border w-full px-2 py-1 rounded mt-1"
                     value={cash} onChange={e=>setCash(e.target.value)}/>
            </label>

            <label className="text-sm">Transferencia $
              <input type="number" step="0.01" min="0"
                     className="border w-full px-2 py-1 rounded mt-1"
                     value={transf} onChange={e=>setTransf(e.target.value)}/>
            </label>
          </div>

          {/* inputs ocultos */}
          <input type="file" multiple accept="image/*"
                 onChange={e=>addFiles(e.target.files)} hidden id="fileInput"/>
          <input type="file" accept="image/*" capture="environment"
                 ref={camInput} onChange={e=>addFiles(e.target.files)} hidden />

          <div className="flex gap-2 mt-3">
            <button type="button"
                    className="flex-1 border py-1 rounded text-xs"
                    onClick={()=>document.getElementById('fileInput').click()}>
              Subir comprobantes
            </button>
            <button type="button"
                    className="flex-1 border py-1 rounded text-xs"
                    onClick={()=>camInput.current.click()}>
              Tomar foto
            </button>
          </div>

          {/* preview imágenes */}
          {imgs.length>0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {imgs.map((src,idx)=>(
                <div key={idx} className="relative group">
                  <img src={src} alt={`img-${idx}`}
                       className="w-full h-20 object-cover rounded border"/>
                  <button type="button" onClick={()=>removeImg(idx)}
                          className="absolute top-0 right-0 bg-red-600 text-white
                                     text-xs px-1 rounded opacity-0 group-hover:opacity-100">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </fieldset>

        {/* acciones */}
        <div className="flex gap-2 mt-4">
          <button type="button" onClick={onClose}
                  className="flex-1 border py-2 rounded hover:bg-gray-50">
            Cancelar
          </button>
          <button type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
