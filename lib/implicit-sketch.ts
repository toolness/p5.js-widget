import esprima = require("esprima");

export default function makeImplicitSketch(code: string) {
  let ast: ESTree.Program;

  try {
    ast = esprima.parse(code);
  } catch (e) {
    return code;
  }

  for (let i = 0; i < ast.body.length; i++) {
    let statement = ast.body[i];
    if (statement.type === esprima.Syntax.FunctionDeclaration) {
      let funcDecl = statement as ESTree.FunctionDeclaration;

      if (funcDecl.id.name === "setup" || funcDecl.id.name === "draw") {
        return code;
      }
    }
  }

  return "function setup() { " + code + " }";
}
