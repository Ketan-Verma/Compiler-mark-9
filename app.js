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
};
// lexer("3+5");
