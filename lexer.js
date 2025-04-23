const CLOCK_SPEED = 1; // 250ms between operations

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }

  toString() {
    return `${this.type}: ${this.value}`;
  }
}

const TokenType = {
  NUM: "NUM",
  PLUS: "PLUS",
  MINUS: "MINUS",
  MUL: "MUL",
  DIV: "DIV",
  LPAREN: "LPAREN",
  RPAREN: "RPAREN",
  EOF: "EOF",
};
/*
start kar
look at 3
Tokenized: NUM -> "3"
make token
move token from right to left
look at next if none
exit
*/
const lexerDiv = document.querySelector(".lexer"); // or use document.getElementById('lexer')
const lexStartMessage = document.createElement("div");
const lexLeftDiv = document.createElement("div");
const sublexLeftDiv = document.createElement("div");

const lexRightDiv = document.createElement("div");
const lexResultDiv = document.querySelector(".lex-result");

function ADD_LEX_DIV() {
  // Get the existing lexer div by ID or class

  // Create the lex-left div
  lexLeftDiv.classList.add("lex-left");
  // sublexLeftDiv.classList.add("lex-left");
  sublexLeftDiv.classList.add("sub-lex-left");

  // Create the lex-right div
  lexRightDiv.classList.add("lex-right");

  // Append lex-left and lex-right divs to the lexer div
  lexerDiv.appendChild(lexLeftDiv);
  lexerDiv.appendChild(lexRightDiv);
  document.querySelector(".lex-result").innerHTML = ``;
  lexLeftDiv.appendChild(sublexLeftDiv);
  lexerDiv.appendChild(lexStartMessage);
}

async function lexer(input) {
  // lexerDiv.style.height = "100vh"; // Set height to auto to allow for dynamic content

  console.log(`input : ${input}`);
  ADD_LEX_DIV();
  lexStartMessage.innerHTML = `<h2 class="main-message">Lexical Analysis</h2>`;
  lexRightDiv.innerHTML = `<h2>input : ${input}</h2>`;
  lexLeftDiv.innerHTML = `<h2>Tokens</h2>`;
  lexLeftDiv.appendChild(sublexLeftDiv);

  sublexLeftDiv.innerHTML = ``;

  let tokens = [];
  let i = 0;

  while (i < input.length) {
    let char = input[i];
    let newToken = null;

    if (/\d/.test(char)) {
      let num = char;
      while (/\d/.test(input[i + 1])) {
        num += input[++i];
      }
      newToken = new Token(TokenType.NUM, num);
      tokens.push(newToken);
    } else if (char === "+") {
      newToken = new Token(TokenType.PLUS, char);
      tokens.push(newToken);
    } else if (char === "-") {
      newToken = new Token(TokenType.MINUS, char);
      tokens.push(newToken);
    } else if (char === "*") {
      newToken = new Token(TokenType.MUL, char);
      tokens.push(newToken);
    } else if (char === "/") {
      newToken = new Token(TokenType.DIV, char);
      tokens.push(newToken);
    } else if (char === "(") {
      newToken = new Token(TokenType.LPAREN, char);
      tokens.push(newToken);
    } else if (char === ")") {
      newToken = new Token(TokenType.RPAREN, char);
      tokens.push(newToken);
    } else if (/\s/.test(char)) {
      // Ignore whitespace
    } else {
      console.error(`Unrecognized character '${char}' at position ${i}`);
      lexResultDiv.innerHTML = ` <div class="lex-message error result anim">
        <p>Error : There is a lexical error.</p>
      </div>`;
      throw new Error(`Unrecognized character '${char}' at position ${i}`);
    }

    if (newToken) {
      // await sleep(CLOCK_SPEED);
      // console.log("look at " + char);
      document
        .querySelector(".scroll-div")
        .scrollIntoView({ behavior: "smooth", block: "center" });

      await sleep(CLOCK_SPEED);
      lexRightDiv.innerHTML = `<h2>input : ${input}</h2><div class="token anim">
                <span class="token-element">${newToken.value}</span>
                <span class="token-type">${newToken.type.substring(0, 3)}</span>
              </div>`;
      //console.log(`Tokenized: ${newToken.type} -> "${newToken.value}"`);
      await sleep(CLOCK_SPEED);
      lexRightDiv.innerHTML = `<h2>input : ${input}</h2>`;
      sublexLeftDiv.innerHTML += `<div class="token anim">
      <span class="token-element">${newToken.value}</span>
      <span class="token-type">${newToken.type.substring(0, 3)}</span>
      </div>`;
    }

    i++;
  }

  document
    .querySelector(".scroll-div")
    .scrollIntoView({ behavior: "smooth", block: "nearest" });
  // Add EOF token
  const eofToken = new Token(TokenType.EOF, "$");
  tokens.push(eofToken);
  await sleep(CLOCK_SPEED);
  //console.log("Tokenized: EOF -> $");
  lexRightDiv.innerHTML = `<h2>input : ${input}</h2><div class="token anim">
                <span class="token-element">$</span>
                <span class="token-type">EoF</span>
              </div>`;

  await sleep(CLOCK_SPEED);
  lexRightDiv.innerHTML = `<h2>input : ${input}</h2>`;
  sublexLeftDiv.innerHTML += `<div class="token anim">
  <span class="token-element">$</span>
  <span class="token-type">EoF</span>
  </div>`;
  await sleep(CLOCK_SPEED);
  lexResultDiv.innerHTML = ` <div class="lex-success success result anim">
  <p>Pass : Lexical analysis complete.</p>
  </div>`;
  document
    .querySelector(".scroll-div")
    .scrollIntoView({ behavior: "smooth", block: "nearest" });
  console.log(`lex-output : ${tokens}`);
  return tokens;
}
