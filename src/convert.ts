type Elements = {
  inputElement?: HTMLTextAreaElement;
  optionElement?: HTMLSelectElement;
  switchElement?: HTMLInputElement;
  nameElement?: HTMLInputElement;
  resElement?: HTMLDivElement;
  errElement?: HTMLParagraphElement;
  buttonElement?: HTMLButtonElement;
  tabSizeElement?: HTMLInputElement;
}

let htmlResult = "";
let optionValue = "interface";
let tab = 0;
let tabSize = 2;
let usingArray = true;
let typeName = "";
let elements: Elements = {};

function getElements() {
  elements = Object.assign(elements, {
    inputElement: document.getElementById("input") as HTMLTextAreaElement,
    optionElement: document.getElementById("convertType") as HTMLSelectElement,
    switchElement: document.getElementById("switch") as HTMLInputElement,
    nameElement: document.getElementById("typeName") as HTMLInputElement,
    resElement: document.getElementById("result") as HTMLDivElement,
    errElement: document.getElementById("error-text") as HTMLParagraphElement,
    buttonElement: document.querySelector<HTMLButtonElement>('#convert')!,
    tabSizeElement: document.getElementById("tabSize") as HTMLInputElement
  })
}

function resetState() {
  const { errElement } = elements;
  errElement!.style.display = 'none';
  htmlResult = "";
  tab = 0;
}

const handleConvert = () => {
  const { resElement } = elements;
  const labelName = `${optionValue} ${typeName || 'Custom'} ${optionValue === 'type' ? '= ' : ''}`;
  const jsonParsed = parseToJSON();

  if (!jsonParsed) return;

  resetState();

  if (!Array.isArray(jsonParsed)) {
    htmlResult += labelName;
  }

  convert(jsonParsed);

  resElement!.style.display = "flex";
  document.getElementById('result-text')!.innerHTML = htmlResult;
}

const handleChangeSelect = () => {
  const { optionElement } = elements;
  optionValue = optionElement!.value;
}

const handleSwitch = () => {
  const { switchElement } = elements;
  usingArray = switchElement!.checked;
}

const handleChangeName = () => {
  const { nameElement } = elements;
  typeName = nameElement!.value;
}

const handleChangeTabSize = () => {
  const { tabSizeElement } = elements;
  tabSize = parseInt(tabSizeElement!.value || '2');
}

function parseToJSON() {
  const { inputElement, errElement, resElement } = elements;
  try {
    return JSON.parse(inputElement!.value);
  } catch (ex) {
    errElement!.style.display = 'block';
    resElement!.style.display = 'none';
    errElement!.innerHTML = ex as string;
    return null;
  }
}

function isObject(obj: any): boolean {
  return typeof obj === "object" && obj;
}

function convert(obj: any) {
  if (Array.isArray(obj)) {
    htmlResult += getArray(obj) + "<br>";
  } else if (isObject(obj)) {
    htmlResult += getObject(obj) + "<br>";
  } else {
    htmlResult += getType(obj) + ";<br>";
  }
}

function getObject(obj: any) {
  let result = "";
  result += "{<br>";
  tab += tabSize;
  for (const key in obj) {
    result += " ".repeat(tab) + key + ": ";
    if (Array.isArray(obj[key])) {
      result += getArray(obj[key]);
    } else {
      result += isObject(obj[key]) ? getObject(obj[key]) : getType(obj[key]);
      result += ";<br>"
    }
  }
  result += " ".repeat(tab - tabSize) + "}";
  tab -= tabSize;
  
  return result;
}

function getArray(arr: any[]) {
  if (!arr.length){
    return usingArray ? "Array&lt;any&gt;;<br>" : "any[];<br>";
  } else {
    if (isObject(arr[0])) {
      let result = "";
      result += usingArray ? `Array&lt;${getObject(arr[0])}&gt;;<br>` : `${getObject(arr[0])}[];<br>`;
      return result;
    } else {
      return usingArray ? `Array&lt;${getType(arr[0])}&gt;;<br>` : `${getType(arr[0])}[];<br>`;
    }
  }
}

function getType(obj: any) {
  return (obj === null || obj === undefined) ? "any" : typeof obj;
}

/**
  * possible type:
  * number
  * string
  * boolean
  * any (if null)
  * Array<object | number | string | boolean>
  * Object<string, object | number | string | boolean>
*/
function setupConvert() {
  getElements();
  const { optionElement, switchElement, nameElement, buttonElement, tabSizeElement } = elements;

  buttonElement!.addEventListener('click', handleConvert);
  optionElement!.addEventListener('change', handleChangeSelect);
  switchElement!.addEventListener('change', handleSwitch);
  nameElement!.addEventListener('change', handleChangeName);
  tabSizeElement!.addEventListener('change', handleChangeTabSize); 
}

function setupCopy(element: HTMLImageElement) {
  element.addEventListener('click', async () => {
    try {
      const result = htmlResult.replaceAll("<br>", "\n").replaceAll("&gt;", ">").replaceAll("&lt;", "<");
      await navigator.clipboard.writeText(result);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  });
}

export default function init() {
  setupConvert();
  setupCopy(document.querySelector<HTMLImageElement>('#copy-icon')!)
}