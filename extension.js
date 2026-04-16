const vscode = require("vscode");

// Supported languages
const SUPPORTED_LANGUAGES = [
  "javascript",
  "javascriptreact",
  "typescript",
  "typescriptreact",
];

// Default colors (fallback if config fails)
const DEFAULT_COLORS = {
  log: "rgba(0, 255, 106, 0.8)", // neon green
  info: "rgba(56, 189, 248, 1)", // sky-400
  warn: "rgba(251, 191, 36, 1)", // amber-400
  error: "rgba(248, 113, 113, 1)", // red-400
  debug: "rgba(167, 139, 250, 1)", // violet-400
  dir: "rgba(148, 163, 184, 1)", // slate-400
};

// Store decoration types for each console method
let decorationTypes = {};

function getConsoleColors() {
  const config = vscode.workspace.getConfiguration();
  // FIXED: Changed from "myHighlighter.colors" to "consoleHighlighter.colors"
  const colors = config.get("consoleHighlighter.colors", DEFAULT_COLORS);
  return { ...DEFAULT_COLORS, ...colors };
}

function getBorderStyle() {
  const config = vscode.workspace.getConfiguration();
  const enableBorder = config.get("consoleHighlighter.enableBorder", false);

  if (enableBorder) {
    return {
      borderWidth: "1px",
      borderStyle: "solid",
      borderRadius: "3px",
    };
  }
  return {};
}

function createDecorationTypes() {
  const colors = getConsoleColors();
  const borderStyle = getBorderStyle();

  // Dispose old decoration types if they exist
  Object.values(decorationTypes).forEach((decoration) => {
    if (decoration) decoration.dispose();
  });

  // Create new decoration types for each console method
  decorationTypes = {
    log: vscode.window.createTextEditorDecorationType({
      backgroundColor: colors.log,
      color: "inherit",
      ...borderStyle,
    }),
    info: vscode.window.createTextEditorDecorationType({
      backgroundColor: colors.info,
      color: "inherit",
      ...borderStyle,
    }),
    warn: vscode.window.createTextEditorDecorationType({
      backgroundColor: colors.warn,
      color: "inherit",
      ...borderStyle,
    }),
    error: vscode.window.createTextEditorDecorationType({
      backgroundColor: colors.error,
      color: "inherit",
      ...borderStyle,
    }),
    debug: vscode.window.createTextEditorDecorationType({
      backgroundColor: colors.debug,
      color: "inherit",
      ...borderStyle,
    }),
    dir: vscode.window.createTextEditorDecorationType({
      backgroundColor: colors.dir,
      color: "inherit",
      ...borderStyle,
    }),
  };
}

function shouldHighlightDocument(document) {
  return SUPPORTED_LANGUAGES.includes(document.languageId);
}

// Robust function to find console statements with proper parenthesis matching
function findConsoleStatements(text) {
  const results = [];
  const methods = ["log", "info", "warn", "error", "debug", "dir"];
  const pattern = new RegExp(`console\\.(${methods.join("|")})\\s*\\(`, "g");

  let match;
  while ((match = pattern.exec(text)) !== null) {
    const method = match[1];
    const start = match.index;
    let parenCount = 1;
    let pos = match.index + match[0].length;

    // Find matching closing parenthesis (handles nested parentheses)
    while (parenCount > 0 && pos < text.length) {
      const char = text[pos];
      if (char === "(") parenCount++;
      if (char === ")") parenCount--;
      pos++;
    }

    if (parenCount === 0) {
      results.push({
        start: start,
        end: pos,
        method: method,
      });
    }
  }

  return results;
}

function updateDecorations(editor) {
  if (!editor) return;

  const document = editor.document;

  // Only highlight supported file types
  if (!shouldHighlightDocument(document)) {
    // Clear all decorations if not supported
    Object.values(decorationTypes).forEach((decorationType) => {
      editor.setDecorations(decorationType, []);
    });
    return;
  }

  const text = document.getText();
  const statements = findConsoleStatements(text);

  // Group decorations by method type
  const decorationsByMethod = {
    log: [],
    info: [],
    warn: [],
    error: [],
    debug: [],
    dir: [],
  };

  for (const stmt of statements) {
    const startPos = document.positionAt(stmt.start);
    const endPos = document.positionAt(stmt.end);
    const range = new vscode.Range(startPos, endPos);

    if (decorationsByMethod[stmt.method]) {
      decorationsByMethod[stmt.method].push({ range });
    }
  }

  // Apply decorations for each method
  for (const [method, decorations] of Object.entries(decorationsByMethod)) {
    if (decorationTypes[method]) {
      editor.setDecorations(decorationTypes[method], decorations);
    }
  }

  // Clear decorations for methods that have no matches (optional but clean)
  for (const method of Object.keys(decorationTypes)) {
    if (
      !decorationsByMethod[method] ||
      decorationsByMethod[method].length === 0
    ) {
      editor.setDecorations(decorationTypes[method], []);
    }
  }
}

function activate(context) {
  // Create decoration types
  createDecorationTypes();

  // Initial decoration
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    updateDecorations(activeEditor);
  }

  // Handle switching editors
  vscode.window.onDidChangeActiveTextEditor(
    (editor) => {
      if (editor) {
        updateDecorations(editor);
      }
    },
    null,
    context.subscriptions,
  );

  // Handle document changes (typing)
  vscode.workspace.onDidChangeTextDocument(
    (event) => {
      const editor = vscode.window.activeTextEditor;
      if (editor && event.document === editor.document) {
        updateDecorations(editor);
      }
    },
    null,
    context.subscriptions,
  );

  // Handle configuration changes
  vscode.workspace.onDidChangeConfiguration(
    (event) => {
      // FIXED: Changed from "myHighlighter" to "consoleHighlighter"
      if (event.affectsConfiguration("consoleHighlighter")) {
        // Recreate decoration types with new colors
        createDecorationTypes();
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          updateDecorations(editor);
        }
      }
    },
    null,
    context.subscriptions,
  );

  // Create status bar item
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100,
  );
  statusBarItem.text = "CH";
  // FIXED: Updated tooltip to include dir
  statusBarItem.tooltip =
    "Console Highlighter Active - Different colors for log/info/warn/error/debug/dir";
  statusBarItem.show();

  // Update status bar when switching files
  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor && shouldHighlightDocument(editor.document)) {
      statusBarItem.text = `CH`;
      statusBarItem.tooltip = `Highlighting ${editor.document.languageId} files with multiple colors`;
    } else if (editor) {
      statusBarItem.text = `CH ×`;
      statusBarItem.tooltip = `No support for ${editor.document.languageId}`;
    }
  });

  context.subscriptions.push(statusBarItem);

  // FIXED: Updated console log to include dir
  console.log("My Console Highlighter activated with multiple colors!");
  console.log("Supported methods: log, info, warn, error, debug, dir");
}

function deactivate() {
  // Clean up decoration types
  Object.values(decorationTypes).forEach((decoration) => {
    if (decoration) decoration.dispose();
  });
}

module.exports = { activate, deactivate };
