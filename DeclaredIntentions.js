// Classe que representa uma declaração de função
class FunctionDeclaration {
    constructor(name, params, returnType) {
      this.name = name;       // Nome da função
      this.params = params;   // Lista de parâmetros
      this.returnType = returnType; // Tipo de retorno da função
    }
  }
  
  // Classe que representa a declaração de um parâmetro de função
  class ParamDeclaration {
    constructor(name, type) {
      this.name = name; // Nome do parâmetro
      this.type = type; // Tipo do parâmetro
    }
  }
  
  // Classe que representa um tipo personalizado
  class Type {
    constructor(name) {
      this.name = name; // Nome do tipo personalizado
    }
  }
  
  // Classe que representa uma expressão de chamada de função
  class CallExpression {
    constructor(funcName, args) {
      this.funcName = funcName; // Nome da função a ser chamada
      this.args = args;         // Lista de argumentos passados para a função
    }
  }
  
  // Classe principal que realiza a verificação de tipos
  class TypeChecker {
    constructor() {
      this.functions = new Map(); // Mapa de funções registradas
      this.customTypes = new Map(); // Mapa de tipos personalizados registrados
    }
  
    // Adiciona uma função ao mapa de funções
    addFunction(func) {
      this.functions.set(func.name, func);
    }
  
    // Adiciona um tipo personalizado ao mapa de tipos personalizados
    addCustomType(type) {
      this.customTypes.set(type.name, type);
    }
  
    // Verifica se uma expressão de chamada de função corresponde aos tipos esperados
    checkType(expression) {
      if (expression instanceof CallExpression) {
        const func = this.functions.get(expression.funcName);
        if (func) {
          if (func.params.length !== expression.args.length) {
            throw new Error(`Erro: Número incorreto de argumentos para "${expression.funcName}". Esperado: ${func.params.length}, Recebido: ${expression.args.length}`);
          }
          for (let i = 0; i < func.params.length; i++) {
            if (!this.checkType(expression.args[i], func.params[i].type)) {
              throw new Error(`Erro: Tipo inválido para o argumento ${i + 1} em "${expression.funcName}". Esperado: ${func.params[i].type.name}, Recebido: ${typeof expression.args[i]}`);
            }
          }
          return true;
        }
        throw new Error(`Erro: Função "${expression.funcName}" não encontrada.`);
      } else if (expression instanceof Type) {
        if (!this.customTypes.has(expression.name)) {
          throw new Error(`Erro: Tipo personalizado "${expression.name}" não encontrado.`);
        }
        return true;
      }
      throw new Error(`Erro: Tipo de expressão não suportado.`);
    }
  }
  
  // Exemplo de uso
  const typeChecker = new TypeChecker();
  
  // Definindo tipos personalizados
  typeChecker.addCustomType(new Type("number"));
  typeChecker.addCustomType(new Type("string"));
  
  // Declarando funções com anotações de tipo
  const addNumbers = new FunctionDeclaration("addNumbers", [new ParamDeclaration("x", new Type("number")), new ParamDeclaration("y", new Type("number"))], new Type("number"));
  typeChecker.addFunction(addNumbers);
  
  const getFullName = new FunctionDeclaration("getFullName", [new ParamDeclaration("firstName", new Type("string")), new ParamDeclaration("lastName", new Type("string"))], new Type("string"));
  typeChecker.addFunction(getFullName);
  
  try {
    // Testando chamadas de função
    const validCall = new CallExpression("addNumbers", [5, 10]);
    typeChecker.checkType(validCall);

  } catch (error) {
    console.error(error.message);
  }
  