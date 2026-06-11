// Mini resaltador de sintaxis Python (sin librerías externas)

const PY_KEYWORDS = new Set([
  "False", "None", "True", "and", "as", "assert", "async", "await", "break",
  "class", "continue", "def", "del", "elif", "else", "except", "finally",
  "for", "from", "global", "if", "import", "in", "is", "lambda", "nonlocal",
  "not", "or", "pass", "raise", "return", "try", "while", "with", "yield",
]);

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Tokenize a single line of Python code into HTML with <span> tags.
function highlightPythonLine(line) {
  let out = "";
  let i = 0;
  const n = line.length;

  while (i < n) {
    const ch = line[i];

    // Comments
    if (ch === "#") {
      out += `<span class="tok-comment">${escapeHtml(line.slice(i))}</span>`;
      break;
    }

    // Strings (including f-strings, single/double quotes)
    if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < n && line[j] !== ch) {
        if (line[j] === "\\") j++;
        j++;
      }
      j = Math.min(j + 1, n);
      out += `<span class="tok-string">${escapeHtml(line.slice(i, j))}</span>`;
      i = j;
      continue;
    }
    if ((ch === "f" || ch === "F") && (line[i + 1] === '"' || line[i + 1] === "'")) {
      const q = line[i + 1];
      let j = i + 2;
      while (j < n && line[j] !== q) {
        if (line[j] === "\\") j++;
        j++;
      }
      j = Math.min(j + 1, n);
      out += `<span class="tok-string">${escapeHtml(line.slice(i, j))}</span>`;
      i = j;
      continue;
    }

    // Numbers
    if (/[0-9]/.test(ch)) {
      let j = i;
      while (j < n && /[0-9.]/.test(line[j])) j++;
      out += `<span class="tok-number">${escapeHtml(line.slice(i, j))}</span>`;
      i = j;
      continue;
    }

    // Identifiers / keywords / pygame attrs / function calls
    if (/[A-Za-z_]/.test(ch)) {
      let j = i;
      while (j < n && /[A-Za-z0-9_]/.test(line[j])) j++;
      const word = line.slice(i, j);

      if (PY_KEYWORDS.has(word)) {
        out += `<span class="tok-keyword">${escapeHtml(word)}</span>`;
      } else if (line[j] === "(") {
        out += `<span class="tok-function">${escapeHtml(word)}</span>`;
      } else if (i > 0 && line[i - 1] === ".") {
        out += `<span class="tok-attr">${escapeHtml(word)}</span>`;
      } else if (/^[A-Z][A-Z0-9_]*$/.test(word) && word.length > 1) {
        out += `<span class="tok-const">${escapeHtml(word)}</span>`;
      } else {
        out += escapeHtml(word);
      }
      i = j;
      continue;
    }

    // Everything else (operators, punctuation, whitespace)
    out += escapeHtml(ch);
    i++;
  }

  return out;
}

// Highlight a full Python code block, return HTML string with one <span class="line"> per line.
function highlightPython(code) {
  return code
    .split("\n")
    .map((line) => `<span class="line">${highlightPythonLine(line)}</span>`)
    .join("");
}

// Highlight a terminal/shell block: dim "#" comments, highlight "$" prompts.
function highlightShell(code) {
  return code
    .split("\n")
    .map((line) => {
      const escaped = escapeHtml(line);
      if (/^\s*#/.test(line)) {
        return `<span class="line tok-comment">${escaped}</span>`;
      }
      if (/^\$/.test(line)) {
        return `<span class="line"><span class="tok-prompt">$</span>${escaped.slice(1)}</span>`;
      }
      return `<span class="line">${escaped}</span>`;
    })
    .join("");
}

window.highlightPython = highlightPython;
window.highlightShell = highlightShell;
window.escapeHtml = escapeHtml;
