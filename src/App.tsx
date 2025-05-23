import { useState } from 'react'

import './App.scss'
import './traductor/helper'
import { convertirAGlifosAethelgard } from './traductor/helper'

const dictionary = [
  { valor: 1, glifo: 'Σ' },
  { valor: 5, glifo: 'Λ' },
  { valor: 10, glifo: 'Ω' },
  { valor: 50, glifo: 'Δ' },
  { valor: 100, glifo: 'Φ' },
  { valor: 500, glifo: 'Ψ' },
  { valor: 1000, glifo: 'Ξ' },
];

function App() {
  const [input, setInput] = useState<string>("");
  const [entries, setEntries] = useState<string[]>([]);
  const [outputs, setOutputs] = useState<{ salida: string, success: boolean }[]>([]);

  // funcion para agregar una entrada
  const handleAddEntry = () => {
    const inputNumber = input;
    if (!inputNumber) return;
    setEntries([...entries, inputNumber]);
    setOutputs([...outputs, convertirAGlifosAethelgard(inputNumber)]);
    setInput("");
  };

  // funcion para agregar una entrada al hacer enter
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddEntry();
    }
  };

  // funcion para cargar un archivo de texto
  const handleLoadFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const numbers = content
          .split('\n')
          .map((line) => line.trim())

        //dejar de mapear cuando encuentre un 0
        const final = numbers.indexOf('0');
        if (final !== -1) {
          numbers.splice(final);
        }

        setEntries([...entries, ...numbers]);
        setOutputs([...outputs, ...numbers.map(num => convertirAGlifosAethelgard(num))]);
      };
      reader.readAsText(file);
    }

    // Resetear el input
    setInput("");
    // Resetear el archivo
    const fileInput = event.target as HTMLInputElement;
    fileInput.value = "";  
  };

  // funcion para eliminar una salida y su entrada correspondiente
  const handleDeleteEntry = (index: number) => {
    const newEntries = [...entries];
    const newOutputs = [...outputs];
    newEntries.splice(index, 1); // eliminar la entrada
    newOutputs.splice(index, 1); // eliminar la salida
    setEntries(newEntries);
    setOutputs(newOutputs);
  }

  // funcion para descargar el archivo de salida
  const handleDownloadFile = () => {
    if (outputs.length === 0) {
      alert("No hay salidas para descargar.");
      return;
    }
    const content = outputs
      .map((output, index) => `${entries[index]} ${output.salida}`)
      .join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.in';
    a.click();
    URL.revokeObjectURL(url);
  };

  // funcion para limpiar las entradas y salidas
  const handleClear = () => {
    setEntries([]);
    setOutputs([]);
  };
  
  return (
    <div className="app">
      <h1>Traductor de Números a Glifos</h1>
      <div className="controls-container">
        <div className="group-1">
          <label className="btn file-input">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
             <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            <span>
              Cargar archivo
            </span>
            <input type="file" accept=".in" onChange={handleLoadFromFile} hidden/>
          </label>
        </div>
        
        <div className="group-2">
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ingresa un número a convertir..."
            onKeyDown={handleKeyDown}
          />
          <button className="btn add-button" onClick={handleAddEntry}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>
              Agregar
            </span>
          </button>
        </div>
      </div>

      {/* <div className="leyenda">
        <h2>Leyenda</h2>
      </div> */}
      <div className="leyenda-bar">
        {dictionary.map(({ valor, glifo }) => (
          <span key={valor} className="tag">
            <strong>{glifo} : {valor}</strong>
          </span>
        ))}
      </div>

      <div className="content">
        <div className="column entradas">
          <h2>Entradas</h2>
          <hr />
          <ul>
            {entries.map((entry, index) => (
              <li key={index}>
                <strong>{index+1}.</strong> {entry}
              </li>
            ))}
          </ul>
        </div>

        <div className="column salidas">
          <h2>Salidas</h2>
          <hr />
          <ul>
            {outputs.map((output, index) => (
              <li key={index} className={output.success ? "success" : "error"}>
                <span>
                  <strong style={{color: 'black'}}>{index+1}. </strong> {output.success ? output.salida : output.salida}
                </span>
                <button className="delete-button" onClick={() => handleDeleteEntry(index)}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer">
        <button className="clear-button" onClick={handleClear} >Limpiar</button>
        <button className="download-button" onClick={handleDownloadFile}>Descargar archivo de salida</button>
      </div>

    </div>
  );
}

export default App;