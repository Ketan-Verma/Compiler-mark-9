const TEMP_PARSE_SPEED = 1;
const PARSE_SPEED = 1;

// Grammar rules representation
const GRAMMAR = {
  E: [["T", "E'"]],
  "E'": [["+", "T", "E'"], ["-", "T", "E'"], ["ε"]],
  T: [["F", "T'"]],
  "T'": [["*", "F", "T'"], ["/", "F", "T'"], ["ε"]],
  F: [["(", "E", ")"], ["NUM"]],
};

// Parsing table
const PARSING_TABLE = {
  E: {
    NUM: ["T", "E'"],
    LPAREN: ["T", "E'"],
  },
  "E'": {
    PLUS: ["+", "T", "E'"],
    MINUS: ["-", "T", "E'"],
    RPAREN: ["ε"],
    EOF: ["ε"],
  },
  T: {
    NUM: ["F", "T'"],
    LPAREN: ["F", "T'"],
  },
  "T'": {
    PLUS: ["ε"],
    MINUS: ["ε"],
    MUL: ["*", "F", "T'"],
    DIV: ["/", "F", "T'"],
    RPAREN: ["ε"],
    EOF: ["ε"],
  },
  F: {
    NUM: ["NUM"],
    LPAREN: ["(", "E", ")"],
  },
};

// Add symbol abbreviation map
const SYMBOL_ABBREVIATIONS = {
  NUM: "num",
  PLUS: "+",
  MINUS: "-",
  MUL: "*",
  DIV: "/",
  LPAREN: "(",
  RPAREN: ")",
  EOF: "$",
};

function getAbbreviatedSymbol(symbol) {
  return SYMBOL_ABBREVIATIONS[symbol] || symbol;
}

async function visualizeParseStep(
  stepNumber,
  stack,
  top,
  lookAhead,
  description,
  parseTree, // Add parseTree parameter
  isLastStep = false,
  isError = false
) {
  return true; // Temporarily return true to avoid errors
  const timestamp = new Date().toISOString().split("T")[1].slice(0, -1);
  const parseOutput = document.querySelector(".parse-process");
  const row = document.createElement("div");
  row.classList.add("parse-step");

  // Add animation delay for smoother appearance
  const style = `
    ${
      isLastStep
        ? isError
          ? "background-color: #ffebee; border-left: 3px solid #f44336;"
          : "background-color: #e8f5e9; border-left: 3px solid #4caf50;"
        : ""
    }
    animation-delay: ${50}ms;
  `;

  row.innerHTML = `
    <div class="parse-text">
      <p style="${style}">
        <span class="timestamp">[${timestamp}]</span> Step ${stepNumber}:
        <br><span class="debug-label">Stack Top:</span> ${getAbbreviatedSymbol(
          top
        )}
        <br><span class="debug-label">Look Ahead:</span> ${getAbbreviatedSymbol(
          lookAhead.value
        )}
        <br><span class="debug-label">Action:</span> ${description}
        <br><span class="debug-label">Stack after Action:</span> ${stack
          .map(getAbbreviatedSymbol)
          .join(" ")}
      </p>
    </div>
    <div class="parse-diagram">
      <canvas id="parseTreeCanvas${stepNumber}" width="400" height="300"></canvas>
    </div>
  `;
  parseOutput.appendChild(row);

  // Draw the parse tree on the canvas
  drawParseTree(parseTree, `parseTreeCanvas${stepNumber}`);

  // Auto scroll to the new element
  row.scrollIntoView({ behavior: "smooth", block: "end" });

  await new Promise((resolve) => setTimeout(resolve, PARSE_SPEED));
}

// ...existing code...

function drawParseTree(parseTree, canvasId) {
  const container = document.getElementById(canvasId).parentElement;
  container.innerHTML = ""; // Clear previous content

  // Set up SVG
  const width = 600;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", "100%")
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`);

  // Create D3 tree layout
  const treeLayout = d3
    .tree()
    .size([
      width - margin.left - margin.right,
      height - margin.top - margin.bottom,
    ]);

  // Convert parse tree to D3 hierarchy
  const root = d3.hierarchy(parseTree);
  const treeData = treeLayout(root);

  // Draw links
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .selectAll("path")
    .data(treeData.links())
    .join("path")
    .attr(
      "d",
      d3
        .linkVertical()
        .x((d) => d.x)
        .y((d) => d.y)
    )
    .attr("fill", "none")
    .attr("stroke", "#333333") // set color to match node stroke
    .attr("stroke-width", 2.5)
    .attr("opacity", 0)
    .transition()
    .duration(500)
    .attr("opacity", 1);

  // Draw nodes
  const nodes = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .selectAll("g")
    .data(treeData.descendants())
    .join("g")
    .attr("transform", (d) => `translate(${d.x},${d.y})`);

  // Add circles for nodes
  nodes
    .append("circle")
    .attr("r", 20)
    .attr("fill", "#90D5ff")
    .attr("stroke", "#333333") // set color to match link stroke
    .attr("stroke-width", 3)
    .attr("opacity", 0)
    .transition()
    .duration(500)
    .attr("opacity", 1);

  // Add text labels
  nodes
    .append("text")
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle")
    .attr("fill", "#00072d")
    .style("font-family", "Consolas")
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .text((d) => getAbbreviatedSymbol(d.data.symbol))
    .attr("opacity", 0)
    .transition()
    .duration(500)
    .attr("opacity", 1);

  // Add hover effects
  // nodes.on("mouseover", function () {
  //   d3.select(this)
  //     .select("circle")
  //     .transition()
  //     .duration(200)
  //     .attr("r", 25)
  //     .attr("fill", "#3c3c3c");
  // });
  // .on("mouseout", function () {
  //   d3.select(this)
  //     .select("circle")
  //     .transition()
  //     .duration(200)
  //     .attr("r", 20)
  //     .attr("fill", "#2d2d2d");
  // });
}

// Remove these functions as they're no longer needed
// calculateNodePositions()
// drawNodes()
// drawConnections()
// getTreeDimensions()

// Modify parse function to build parseTree and pass it to visualizeParseStep
// PARSE_SPEED = 1000;
const parser_container = document.querySelector(".parse-container");
//! put it inside function
async function parse(tokens) {
  parser_container.innerHTML = "";
  const parser_div = document.createElement("div");
  parser_div.classList.add("parser");

  const before_stack_div = document.createElement("div");
  before_stack_div.classList.add("before-stack-container");
  before_stack_div.classList.add("stack-container");
  before_stack_div.classList.add("block");

  const action_div = document.createElement("div");
  action_div.classList.add("actions");
  action_div.classList.add("block");

  const current_stack_div = document.createElement("div");
  current_stack_div.classList.add("current-stack-container");
  current_stack_div.classList.add("stack-container");
  current_stack_div.classList.add("block");

  const diagram_div = document.createElement("div");
  diagram_div.classList.add("diagram");
  diagram_div.classList.add("block");
  parser_div.appendChild(before_stack_div);
  parser_div.appendChild(action_div);
  parser_div.appendChild(current_stack_div);
  parser_div.appendChild(diagram_div);

  parser_container.appendChild(parser_div);
  await sleep(PARSE_SPEED);
  // ------------------------------------------------------------
  const stack = ["$", "E"];

  before_stack_div.innerHTML = `<h3>
            stack <br />
            before
          </h3>
          <ul class="stack before-stack">
           
          </ul>`;
  document
    .querySelector(".scroll-div")
    .scrollIntoView({ behavior: "smooth", block: "end" });
  await sleep(TEMP_PARSE_SPEED);
  let currentToken = 0;
  let stepNumber = 1;

  // Initialize parse tree with start symbol
  const parseTreeRoot = new ParseTreeNode("E");

  // Stack to keep track of parse tree nodes
  const parseTreeStack = [parseTreeRoot];

  // Clear previous parse output and show initial input
  const parseOutput = document.querySelector(".parse-process");
  /* parseOutput.innerHTML = `
    <h3>Parsing Steps:</h3>
    <p>Input String: ${tokens.map((t) => t.value || t.type).join(" ")}</p>
  `;*/
  // await sleep(CLOCK_SPEED);
  // console.log("show tokens");

  action_div.innerHTML = `<h3 class="step-count">Step: ${stepNumber++}</h3><h3>Initialization</h3>
  <h4>Stack Operation:</h4>
  <div class="par-action">
  <p>push $ and E to stack</p>
  </div>`;
  document
    .querySelector(".scroll-div")
    .scrollIntoView({ behavior: "smooth", block: "end" });
  await sleep(TEMP_PARSE_SPEED);
  current_stack_div.innerHTML = `<h3>
  stack <br />
  after
  </h3>
  <ul class="stack current-stack">
  <li>$</li>
  <li>E</li>
  </ul>`;
  diagram_div.innerHTML = `<h3>Parse Tree for step ${
    stepNumber - 1
  }</h3><canvas id="newparseTreeCanvas${
    stepNumber - 1
  }" width="400" height="300"></canvas>`;
  drawParseTree(parseTreeRoot, `newparseTreeCanvas${stepNumber - 1}`);
  console.log("initialize stack, push $ and E");
  document
    .querySelector(".scroll-div")
    .scrollIntoView({ behavior: "smooth", block: "end" });
  await sleep(PARSE_SPEED);
  try {
    while (stack.length > 0) {
      //!temp
      const temp_parser_div = document.createElement("div");
      temp_parser_div.classList.add("parser");
      parser_container.appendChild(temp_parser_div);

      const temp_before_stack_div = document.createElement("div");
      temp_before_stack_div.classList.add("before-stack-container");
      temp_before_stack_div.classList.add("stack-container");
      temp_before_stack_div.classList.add("block");

      const temp_action_div = document.createElement("div");
      temp_action_div.classList.add("actions");
      temp_action_div.classList.add("block");

      const temp_current_stack_div = document.createElement("div");
      temp_current_stack_div.classList.add("current-stack-container");
      temp_current_stack_div.classList.add("stack-container");
      temp_current_stack_div.classList.add("block");

      const temp_diagram_div = document.createElement("div");
      temp_diagram_div.classList.add("diagram");
      temp_diagram_div.classList.add("block");
      temp_parser_div.appendChild(temp_before_stack_div);
      temp_parser_div.appendChild(temp_action_div);
      temp_parser_div.appendChild(temp_current_stack_div);
      temp_parser_div.appendChild(temp_diagram_div);
      //!temp
      document
        .querySelector(".scroll-div")
        .scrollIntoView({ behavior: "smooth", block: "end" });

      temp_before_stack_div.innerHTML = `<h3>
            stack <br />
            before
          </h3>
          <ul class="stack before-stack">
           ${stack
             .map((item, index) =>
               index == stack.length - 1
                 ? `<li id="bg-red">${item}</li>`
                 : `<li  >${item}</li>`
             )
             .join("")}
          </ul>`;
      temp_current_stack_div.innerHTML = `<h3>
            stack <br />
            after
          </h3>
          <ul class="stack after-stack">
           ${stack
             .map((item, index) =>
               index == stack.length - 1
                 ? `<li id="bg-red">${item}</li>`
                 : `<li  >${item}</li>`
             )
             .join("")}
          </ul>`;
      document
        .querySelector(".scroll-div")
        .scrollIntoView({ behavior: "smooth", block: "end" });
      await sleep(TEMP_PARSE_SPEED);
      const top = stack[stack.length - 1];
      const currentSymbol = tokens[currentToken];

      let description = "";

      const currentNode = parseTreeStack[parseTreeStack.length - 1];

      if (top === "$" && currentSymbol.type === "EOF") {
        description = "Success! Both stack top and input are $";
        await visualizeParseStep(
          stepNumber++,
          stack,
          top,
          currentSymbol,
          description,
          parseTreeRoot,
          true,
          false
        ); /**/
        await sleep(TEMP_PARSE_SPEED);
        // console.log(stepNumber++, stack, top, currentSymbol, description);

        temp_current_stack_div.innerHTML = `<h3>
            stack <br />
            after
          </h3>
          <ul class="stack current-stack">
            
          </ul>`;
        await sleep(TEMP_PARSE_SPEED);
        temp_action_div.innerHTML = `
          <h3 class="step-count">Step: ${stepNumber - 1}</h3>
            <h4 class="green-clr">Parsing Done Successfully</h4>
            <div class="par-action">
              
              
            </div>`;
        temp_diagram_div.innerHTML = `<h3>Parse Tree for step ${
          stepNumber - 1
        }</h3><canvas id="newparseTreeCanvas${stepNumber}" width="400" height="300"></canvas>`;
        drawParseTree(parseTreeRoot, `newparseTreeCanvas${stepNumber}`);

        let temp_div = document.createElement("div");
        temp_div.classList.add("parse-result");
        temp_div.innerHTML = ` <div class="lex-success success result anim">
  <p>Parsing successful.</p>
  </div>`;
        parser_container.appendChild(temp_div);
        document
          .querySelector(".scroll-div")
          .scrollIntoView({ behavior: "smooth", block: "end" });

        return true;
      }

      if (top === "ε") {
        description = "Pop ε from stack";
        //! clocktime add
        //
        await sleep(TEMP_PARSE_SPEED);
        temp_action_div.innerHTML = `
        <h3 class="step-count">Step: ${stepNumber}</h3>
          <h4>Stack Operation:</h4>
          <div class="par-action">
            <p>top element of stack is &epsilon;.</p>
            <p>So we perform pop() operation</p><br/>
            <p><span id="red-clr"> pop()</span></p>
            
          </div>`;
        temp_diagram_div.innerHTML = `<h3>Parse Tree for step ${stepNumber}</h3><canvas id="newparseTreeCanvas${stepNumber}" width="400" height="300"></canvas>`;

        stack.pop();
        parseTreeStack.pop();
        await sleep(TEMP_PARSE_SPEED);
        // console.log(stepNumber++, stack, top, currentSymbol, description);
        temp_current_stack_div.innerHTML = `<h3>
        current <br />
        stack
      </h3>
      <ul class="stack current-stack">
        ${stack.map((item) => `<li>${item}</li>`).join("")}
      
      </ul>`;
        document
          .querySelector(".scroll-div")
          .scrollIntoView({ behavior: "smooth", block: "end" });

        await visualizeParseStep(
          stepNumber++,
          stack,
          top,
          currentSymbol,
          description,
          parseTreeRoot
        ); /**/
        temp_diagram_div.innerHTML = `<h3>Parse Tree for step ${stepNumber}</h3><canvas id="newparseTreeCanvas${stepNumber}" width="400" height="300"></canvas>`;

        drawParseTree(parseTreeRoot, `newparseTreeCanvas${stepNumber}`);

        continue;
      }

      if (isTerminal(top)) {
        if (matchesTerminal(top, currentSymbol)) {
          description = `Match: ${top} = ${currentSymbol.type}. Pop stack and advance input`;
          //!

          // await sleep(TEMP_PARSE_SPEED);
          temp_action_div.innerHTML = `
          <h3 class="step-count">Step: ${stepNumber}</h3>
          <h4>Stack Operation:</h4>
          <div class="par-action">
            <p>Stack top is terminal so we perform pop operation</p>
            <br/>
            <p><span id="red-clr"> pop()</span></p>
            
          </div>`;

          await sleep(TEMP_PARSE_SPEED);
          stack.pop();
          parseTreeStack.pop();
          currentNode.symbol = top;
          await visualizeParseStep(
            stepNumber++,
            stack,
            top,
            currentSymbol,
            description,
            parseTreeRoot
          );
          temp_diagram_div.innerHTML = `<h3>Parse Tree for step ${stepNumber}</h3><canvas id="newparseTreeCanvas${stepNumber}" width="400" height="300"></canvas>`;

          drawParseTree(parseTreeRoot, `newparseTreeCanvas${stepNumber}`);

          /**/
          // await sleep(TEMP_PARSE_SPEED);
          // console.log(stepNumber++, stack, top, currentSymbol, description);
          temp_current_stack_div.innerHTML = `<h3>
            stack <br />
            after
          </h3>
          <ul class="stack current-stack">
            ${stack.map((item) => `<li>${item}</li>`).join("")}
          
          </ul>`;
          await sleep(PARSE_SPEED);
          document
            .querySelector(".scroll-div")
            .scrollIntoView({ behavior: "smooth", block: "end" });

          currentToken++;
        } else {
          await visualizeParseStep(
            stepNumber++,
            stack,
            top,
            currentSymbol,
            description,
            parseTreeRoot,
            true,
            true
          ); /**/
          await sleep(TEMP_PARSE_SPEED);
          // console.log(stepNumber++, stack, top, currentSymbol, description);
          temp_current_stack_div.innerHTML = `<h3>
            stack <br />
            after
          </h3>
          <ul class="stack current-stack">
            ${stack.map((item) => `<li>${item}</li>`).join("")}
          
          </ul>`;
          document
            .querySelector(".scroll-div")
            .scrollIntoView({ behavior: "smooth", block: "end" });
          console.error(
            `Parsing error: Expected ${top}, got ${currentSymbol.type}`
          );
          // Immediately throw error and stop
          throw new Error(
            `Parsing error: Expected ${top}, got ${currentSymbol.type}`
          );
        }
      } else {
        const production = PARSING_TABLE[top]?.[currentSymbol.type];
        if (production) {
          description = `M[${top},${
            currentSymbol.type
          }] = ${top} → ${production.join(" ")}`;

          // await sleep(TEMP_PARSE_SPEED);
          temp_action_div.innerHTML = `
          <h3 class="step-count">Step: ${stepNumber}</h3>
          <h4>Stack Operation:</h4>
          <div class="par-action">
            <p>Stack top is non-terminal so we pop it</p>
            <br/>
            <p><span id="red-clr"> pop()</span></p>
            
          </div>`;
          // temp_diagram_div.innerHTML = `<h3>Parse Tree for step ${stepNumber}</h3><canvas id="newparseTreeCanvas${stepNumber}" width="400" height="300"></canvas>`;

          await sleep(TEMP_PARSE_SPEED);
          stack.pop();
          parseTreeStack.pop();

          // Replace non-terminal with production
          let newNodes = production.map((sym) => new ParseTreeNode(sym));
          currentNode.children = newNodes;
          let just_a_temp = [];
          // Push production symbols and corresponding parse tree nodes onto stacks
          for (let i = production.length - 1; i >= 0; i--) {
            stack.push(production[i]);
            just_a_temp.push(production[i]);
            parseTreeStack.push(newNodes[i]);
            temp_action_div.innerHTML = `
            <h3 class="step-count">Step: ${stepNumber}</h3>
          <h4>Stack Operation:</h4>
          <div class="par-action">
            <p>Stack top is non-terminal so we pop it</p>
            <br/>
            <p><span id="red-clr"> pop()</span></p>
            <br/>
            <p>We will look at production rules and will push elements in reverse order</p>
            <br/>
            ${just_a_temp
              .map(
                (item) => `<p><span class ="green-clr">push(${item})</span></p>`
              )
              .join("")}

          
              </div>`;
            await sleep(TEMP_PARSE_SPEED);
            temp_current_stack_div.innerHTML = `<h3>
            stack <br />
            after
          </h3>
          <ul class="stack current-stack">
            ${stack
              .map((item, index) =>
                index == stack.length - 1
                  ? `<li id ="green-clr">${item}</li>`
                  : `<li >${item}</li>`
              )
              .join("")}
          
          </ul>`;
            await sleep(TEMP_PARSE_SPEED);
          }

          await sleep(TEMP_PARSE_SPEED);
          // console.log(stepNumber++, stack, top, currentSymbol);
          /*
          temp_current_stack_div.innerHTML = `<h3>
            stack <br />
            after
          </h3>
          <ul class="stack current-stack">
            ${stack.map((item) => `<li>${item}</li>`).join("")}
          
          </ul>`;
*/
          document
            .querySelector(".scroll-div")
            .scrollIntoView({ behavior: "smooth", block: "end" });
          await visualizeParseStep(
            stepNumber++,
            stack,
            top,
            currentSymbol,
            description,
            parseTreeRoot
          ); /**/
          temp_diagram_div.innerHTML = `<h3>Parse Tree for step ${stepNumber}</h3><canvas id="newparseTreeCanvas${stepNumber}" width="400" height="300"></canvas>`;

          // Draw the parse tree on the canvas
          drawParseTree(parseTreeRoot, `newparseTreeCanvas${stepNumber}`);
        } else {
          // await sleep(TEMP_PARSE_SPEED);
          // console.log(stepNumber++, stack, top, currentSymbol, description);
          temp_current_stack_div.innerHTML = `<h3>
            stack <br />
            after
          </h3>
          <ul class="stack current-stack">
            ${stack.map((item) => `<li>${item}</li>`).join("")}
          
          </ul>`;
          await sleep(PARSE_SPEED);
          document
            .querySelector(".scroll-div")
            .scrollIntoView({ behavior: "smooth", block: "end" });

          await visualizeParseStep(
            stepNumber++,
            stack,
            top,
            currentSymbol,
            description,
            parseTreeRoot,
            true,
            true
          );
          temp_diagram_div.innerHTML = `<h3>Parse Tree for step ${stepNumber}</h3><canvas id="newparseTreeCanvas${stepNumber}" width="400" height="300"></canvas>`;

          // Draw the parse tree on the canvas
          drawParseTree(parseTreeRoot, `newparseTreeCanvas${stepNumber}`);
          /**/

          console.error(
            `No production in parsing table for ${top} with ${currentSymbol.type}`
          );
          // Immediately throw error and stop
          throw new Error(
            `No production in parsing table for ${top} with ${currentSymbol.type}`
          );
          return;
        }
      }

      document
        .querySelector(".scroll-div")
        .scrollIntoView({ behavior: "smooth", block: "end" });
      await sleep(PARSE_SPEED);
    }
    return false;
  } catch (error) {
    // Ensure error styling is applied even if there's an exception
    // await sleep(TEMP_PARSE_SPEED);
    console.error(error);

    /*const errorStep = document.querySelector(".parse-process p:last-child");
    if (errorStep) {
      errorStep.style.backgroundColor = "#ffebee";
      errorStep.style.borderLeft = "3px solid #f44336";
    }*/
    throw error;
  }
}

// ParseTreeNode class
class ParseTreeNode {
  constructor(symbol) {
    this.symbol = symbol;
    this.children = [];
    this.x = 0;
    this.y = 0;
  }
}

function isTerminal(symbol) {
  return !GRAMMAR.hasOwnProperty(symbol);
}

function matchesTerminal(terminal, token) {
  if (terminal === "NUM") return token.type === "NUM";
  if (terminal === "+") return token.type === "PLUS";
  if (terminal === "-") return token.type === "MINUS";
  if (terminal === "*") return token.type === "MUL";
  if (terminal === "/") return token.type === "DIV";
  if (terminal === "(") return token.type === "LPAREN";
  if (terminal === ")") return token.type === "RPAREN";
  return false;
}
