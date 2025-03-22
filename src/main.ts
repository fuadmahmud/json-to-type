import './style.css'
import init from './convert.ts'
import copySvg from './copy.svg';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="wrapper">
    <textarea id="input" placeholder="Paste your JSON here"></textarea>
    <select id="convertType">
      <option value="interface">Interface</option>
      <option value="type">Type</option>
    </select>
    <input placeholder="Type/Interface name (Optional)" id="typeName" />
    <input placeholder="Type size (Optional)" id="tabSize" type="number" min=2 />
    <div class="switch-wrapper">
      <p>Use Array&lt;T&gt;</p>
      <label class="switch">
        <input type="checkbox" checked id="switch">
        <span class="slider round"></span>
      </label>
    </div>
    <button id="convert">Convert</button>
    <p id="error-text"></p>
    <div id="result">
      <pre id="result-text">
      </pre>
      <img id="copy-icon" src=${copySvg} alt="copy-icon" height=24 width=24  />
    </div>
  </div>
`

init();
