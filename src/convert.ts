let htmlResult = "";
let optionValue = "interface";
let tab = 2;
let usingArray = true;
let typeName = "";

function setupConvert(element: HTMLButtonElement) {
  const input = document.getElementById("input") as HTMLTextAreaElement;
  const option = document.getElementById("convertType") as HTMLSelectElement;
  const switchElement = document.getElementById("switch") as HTMLInputElement;
  const nameElement = document.getElementById("typeName") as HTMLInputElement;
  /**
   * possible type:
   * number
   * string
   * boolean
   * any (if null)
   * Array<object | number | string | boolean>
   * Object<string, object | number | string | boolean>
   */
  const handleConvert = () => {
    const resElement = document.getElementById("result") as HTMLDivElement;
    const errElement = document.getElementById('error-text') as HTMLParagraphElement;
    const labelName = `${typeName ? optionValue + ' ' + typeName : optionValue + ' ' + 'Custom'} {<br>`;
    errElement.style.display = 'none';
    htmlResult = "";
    tab = 2;
    let jsonParsed;
    try {
      jsonParsed = JSON.parse(input.value);
    } catch (ex) {
      errElement.style.display = 'block';
      resElement.style.display = 'none';
      errElement.innerHTML = ex as string;
      return;
    }
    if (!Array.isArray(jsonParsed)) {
      htmlResult += labelName;
    }

    cvrt(jsonParsed);
    if (jsonParsed && !Array.isArray(jsonParsed) && typeof jsonParsed === "object") {
      htmlResult += "}";
    }
    resElement.style.display = "flex";
    document.getElementById('result-text')!.innerHTML = htmlResult;
  }

  const handleChangeSelect = () => {
    optionValue = option.value;
  }

  const handleSwitch = () => {
    usingArray = switchElement.checked;
  }

  const handleChangeName = () => {
    typeName = nameElement.value;
  }

  element.addEventListener('click', handleConvert);
  option.addEventListener('change', handleChangeSelect);
  switchElement.addEventListener('change', handleSwitch);
  nameElement.addEventListener('change', handleChangeName);
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

function isObject(obj: any): boolean {
  return typeof obj === "object";
}

function cvrt(obj: any, child?: boolean) {
  if (obj === null || obj === undefined) {
    // null ok
    htmlResult += "any;<br>";
  } else if (Array.isArray(obj)) {
    // array ok
    if (obj.length === 0){
      htmlResult += `Array&lt;any&gt;;<br>`;
    } else {
      const iobj = isObject(obj[0]);
      htmlResult += !iobj ? `Array&lt;${typeof obj[0]}&gt;;<br>` : "Array<{<br>";
      if (iobj) {
        tab += 2;
        cvrt(obj[0]);
        tab -= 2;
        htmlResult += " ".repeat(tab);
        htmlResult += !iobj ? "&gt;" : "}&gt;;<br>";
      }
    }
    return;
  } else if (isObject(obj)) {
    if (child) {
      htmlResult += "{<br>";
      tab += 2;
    }
    for (const key in obj) {
      htmlResult += " ".repeat(tab) + key + ": ";
      cvrt(obj[key], true);
    }
    if (child) {
      htmlResult += " ".repeat(tab - 2) + "}<br>";
      tab -= 2;
    }
  } else {
    // other ok
    htmlResult += typeof obj + ";<br>";
  }

  return;
}

export default function init() {
  setupConvert(document.querySelector<HTMLButtonElement>('#convert')!)
  setupCopy(document.querySelector<HTMLImageElement>('#copy-icon')!)
}