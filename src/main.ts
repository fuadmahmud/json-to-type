import './style.css'
import { setupConvert, setupCopy } from './convert.ts'
import copySvg from './copy.svg';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="wrapper">
    <textarea id="input" placeholder="Paste your JSON here"></textarea>
    <select id="convertType">
      <option value="interface">Interface</option>
      <option value="type">Type</option>
    </select>
    <button id="convert">Convert</button>
    <p id="error-text"></p>
    <div id="result">
      <pre id="result-text">
      </pre>
      <img id="copy-icon" src=${copySvg} alt="copy-icon" height=24 width=24  />
    </div>
  </div>
`

setupConvert(document.querySelector<HTMLButtonElement>('#convert')!)
setupCopy(document.querySelector<HTMLImageElement>('#copy-icon')!)