const sdtContainer = document.querySelector(".sdt-container");
let astStep = 0;

function displayStep(message) {
  const stepElement = document.createElement("div");
  stepElement.textContent = message;
  sdtContainer.appendChild(stepElement);
}

// Syntax Directed Definition (SDD) rules for converting parse tree to AST
function parseTreeToAST(node) {
  ++astStep;
  const stepMessage = `Step ${astStep}: Processing node '${node.symbol}'`;
  displayStep(stepMessage);

  // Handle epsilon (empty) nodes
  if (!node || node.symbol === "ε") {
    displayStep(`Step ${astStep}: Node is epsilon, returning null`);
    return null;
  }

  // Handle terminal nodes (NUM)
  if (node.isTerminal && node.symbol === "NUM") {
    const terminalMessage = `Step ${astStep}: Terminal node '${node.symbol}' with value '${node.symbolValue}'`;
    displayStep(terminalMessage);
    return {
      type: "Number",
      value: parseInt(node.symbolValue),
    };
  }

  // Handle non-terminals based on SDD rules
  switch (node.symbol) {
    case "E": {
      displayStep(`Step ${astStep}: Applying rule E → T E'`);
      const left = parseTreeToAST(node.children[0]); // T
      const result = parseEPrime(node.children[1], left); // E'
      displayStep(
        `Step ${astStep}: Completed E → T E', result: ${JSON.stringify(result)}`
      );
      return result;
    }

    case "T": {
      displayStep(`Step ${astStep}: Applying rule T → F T'`);
      const left = parseTreeToAST(node.children[0]); // F
      const result = parseTPrime(node.children[1], left); // T'
      displayStep(
        `Step ${astStep}: Completed T → F T', result: ${JSON.stringify(result)}`
      );
      return result;
    }

    case "F": {
      if (node.children[0].symbol === "NUM") {
        displayStep(`Step ${astStep}: Applying rule F → NUM`);
        const result = parseTreeToAST(node.children[0]);
        displayStep(
          `Step ${astStep}: Completed F → NUM, result: ${JSON.stringify(
            result
          )}`
        );
        return result;
      } else if (node.children[0].symbol === "(") {
        displayStep(`Step ${astStep}: Applying rule F → ( E )`);
        const result = parseTreeToAST(node.children[1]); // E
        displayStep(
          `Step ${astStep}: Completed F → ( E ), result: ${JSON.stringify(
            result
          )}`
        );
        return result;
      }
      return null;
    }

    default:
      displayStep(`Step ${astStep}: Unhandled non-terminal '${node.symbol}'`);
      return null;
  }
}

// Helper function for E' → + T E' | - T E' | ε
function parseEPrime(node, left) {
  if (node.children[0].symbol === "ε") {
    displayStep(`Step ${astStep}: Applying rule E' → ε`);
    return left;
  }

  const operator = node.children[0].symbol; // + or -
  displayStep(`Step ${astStep}: Applying rule E' → ${operator} T E'`);
  const right = parseTreeToAST(node.children[1]); // T
  const binaryExpression = {
    type: "BinaryExpression",
    operator: operator,
    left: left,
    right: right,
  };
  displayStep(
    `Step ${astStep}: Created BinaryExpression for '${operator}', result: ${JSON.stringify(
      binaryExpression
    )}`
  );
  return parseEPrime(node.children[2], binaryExpression); // E'
}

// Helper function for T' → * F T' | / F T' | ε
function parseTPrime(node, left) {
  if (node.children[0].symbol === "ε") {
    displayStep(`Step ${astStep}: Applying rule T' → ε`);
    return left;
  }

  const operator = node.children[0].symbol; // * or /
  displayStep(`Step ${astStep}: Applying rule T' → ${operator} F T'`);
  const right = parseTreeToAST(node.children[1]); // F
  const binaryExpression = {
    type: "BinaryExpression",
    operator: operator,
    left: left,
    right: right,
  };
  displayStep(
    `Step ${astStep}: Created BinaryExpression for '${operator}', result: ${JSON.stringify(
      binaryExpression
    )}`
  );
  return parseTPrime(node.children[2], binaryExpression); // T'
}

// Function to visualize the AST
function visualizeAST(node, depth = 0) {
  if (!node) return "";

  const indent = "  ".repeat(depth);

  if (node.type === "Number") {
    return `${indent}${node.value}`;
  } else if (node.type === "BinaryExpression") {
    return `${indent}${node.operator}\n${visualizeAST(
      node.left,
      depth + 1
    )}\n${visualizeAST(node.right, depth + 1)}`;
  } else {
    return `${indent}${JSON.stringify(node)}`;
  }
}

// Function to evaluate the AST
function evaluateAST(node) {
  if (!node) return null;

  if (node.type === "Number") {
    return node.value;
  } else if (node.type === "BinaryExpression") {
    const left = evaluateAST(node.left);
    const right = evaluateAST(node.right);

    switch (node.operator) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "*":
        return left * right;
      case "/":
        return left / right;
      default:
        return null;
    }
  }
  return null;
}

// Function to convert AST to expression string
function astToExpression(node) {
  if (!node) return "";

  if (node.type === "Number") {
    return node.value.toString();
  } else if (node.type === "BinaryExpression") {
    const leftExpr = astToExpression(node.left);
    const rightExpr = astToExpression(node.right);
    return `(${leftExpr} ${node.operator} ${rightExpr})`;
  }
  return "";
}
