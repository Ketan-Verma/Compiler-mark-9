/*
done make log 
make lexer
*/
const inputExpression = document.getElementById("expression");
const compileBtn = document.getElementById("expButton");

compileBtn.onclick = async function () {
  const expression = inputExpression.value.trim();
  // console.log(expression);
  document.querySelector(".parse-container").innerHTML = ``;
  let tokens = await lexer(expression);
  let parse_tree = await parse(tokens);
  console.log(JSON.stringify(parse_tree));
  // Convert the parse tree to AST
  // const ast = await parseTreeToAST(parse_tree);

  // Print results
  // console.log("Parse Tree to AST Conversion:");
  // console.log(JSON.stringify(ast, null, 2));

  // console.log("\nAST Visualization:");
  // console.log(visualizeAST(ast));

  // console.log("\nExpression from AST:");
  // console.log(astToExpression(ast));

  // console.log("\nAST Evaluation:");
  // console.log(evaluateAST(ast));

  // Let's break down the expression to see all operations step by step
  // console.log("\nStep-by-step Evaluation:");
  function explainEvaluation(node) {
    return;
    if (!node) return "";

    if (node.type === "Number") {
      return `${node.value}`;
    } else if (node.type === "BinaryExpression") {
      const leftValue = evaluateAST(node.left);
      const rightValue = evaluateAST(node.right);
      const result = evaluateAST(node);

      const leftExpr = explainEvaluation(node.left);
      const rightExpr = explainEvaluation(node.right);

      if (
        node.left.type === "BinaryExpression" ||
        node.right.type === "BinaryExpression"
      ) {
        return `(${leftExpr} ${node.operator} ${rightExpr}) = ${result}`;
      } else {
        return `${leftValue} ${node.operator} ${rightValue} = ${result}`;
      }
    }
    return "";
  }
  // console.log(explainEvaluation(ast));
};
// lexer("3+5");
