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
  parse(tokens);
};
// lexer("3+5");
