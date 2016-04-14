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

    if (statement.type === esprima.Syntax.VariableDeclaration) {
      let varDecl = statement as ESTree.VariableDeclaration;

      for (let j = 0; j < varDecl.declarations.length; j++) {
        // This is a bit odd because our ESTree typings indicate
        // that a VariableDeclarator.id is a Pattern, but it
        // seems to actually be an Identifier, so we'll forcibly
        // typecast it as such.
        let id = varDecl.declarations[j].id as ESTree.Identifier;

        if (id.name === "setup" || id.name === "draw") {
          return code;
        }
      }
    }
  }

  return "function setup() { " + code + " }";
}
