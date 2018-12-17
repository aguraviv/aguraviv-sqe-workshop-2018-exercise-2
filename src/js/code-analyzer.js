import * as esprima from 'esprima';
//const new_line_object = (line,type,name, condition, value) => ({line,type,name,condition,value});
//var string_range_code;
var codeSoFar = [];// fields of: {line: the_line_code[index], need_to_delete: false, is_it_statement: false}
var returnCode = []; //field of: codeSoFar[index].line
var global_and_function_variables =[]; //{variables_name: his name, variable_value: his value }
//var input_vector_values = [];
var string_of_input = '';

const parseCode = (codeToParse,input_vactor) => {
    let the_line_code = codeToParse.split('\n');
    for(let index=0; index < the_line_code.length; index++ ){
        codeSoFar.push({line: the_line_code[index], need_to_delete: false, is_it_statement: false, color: 1});
    }
    var tetee = '(' + input_vactor + ')';
    var object_input = eval(tetee);
    var values_of_input = Object.values(object_input);
    var names_of_input = Object.keys(object_input);
    for(var i =0; i<names_of_input.length; i++){
        string_of_input = string_of_input + 'var ' + names_of_input[i] + ' = ' + values_of_input[i] + ';';
    }
    //console.log("string_of_input" + string_of_input);
    const root = use_loc_to_parse(codeToParse);
    module_builder(root);
    update_array_to_return();
    return returnCode;
};
const use_loc_to_parse = (codeToParse) => esprima.parseScript(codeToParse, {loc: true, range: true});

const update_array_to_return = () => {
    for(var index =0; index < codeSoFar.length; index++){
        if(codeSoFar[index].need_to_delete === false){
            returnCode.push({line: codeSoFar[index].line, color: codeSoFar[index].color});
        }
    }
};
       
    
const module_builder= (root) =>{
    if(root!==null){
        switch(root.type){
        case 'Program' :  program_helper(root); break;
        case 'BlockStatement' : program_helper(root); break;
        case 'FunctionDeclaration': function_decleration_parser(root); break;
        default: return module_builder_second(root);
        }}};

const module_builder_second = (root) =>{
    switch(root.type){
    case 'VariableDeclaration' :variable_decleration_parser_for_array(root); break;
    case 'ExpressionStatement' : expression_statement_parser(root); break;
    case 'ReturnStatement' : return_statement_parser(root); break;
    case 'IfStatement' : if_statement_parser(root); break;
    default: return module_builder_third(root);
    }
};

const module_builder_third = (root) =>{
    switch(root.type){
    //case 'ForStatement' : for_statement_parser(root); break;
    //case 'UpdateExpression' : update_expression_parser(root); break;
    case 'WhileStatement' : while_statement_parser(root); break;
    //case 'UnaryExpression' : return Unary_Expression_parser(root) ; 
    case 'Literal': return literal_parser(root); 
    default:  return module_builder_forth(root);
    }
};

const module_builder_forth = (root) =>{
    switch(root.type){
    case 'BinaryExpression' : return Binary_Expression_parser(root); 
    case 'Identifier': return identifier_parser(root);
    //case 'MemberExpression' : return Member_Expression_parser(root);
    }
};


const Binary_Expression_parser = (root) => {
    var left = module_builder(root.left);
    var operator = root.operator;
    var  right=  module_builder(root.right);
    var s =  left + ' '+operator +' '+ right ;
    return s;
};

//takes the new value if there is one from the table by it's name
const identifier_parser = (root) => {
    let name_of_variable= root.name;
    let the_new_value_to_enter = global_and_function_variables.findIndex((x) => x.variables_name === name_of_variable);
    return global_and_function_variables[the_new_value_to_enter].variable_value;
};
const literal_parser = (root) => {
    return root.value;
};

const program_helper = (root) => {
    for(var i =0; i<root.body.length; i++){
        module_builder(root.body[i]);
    }
};

const function_decleration_parser = (root) => {
    for(var i =0; i<root.params.length; i++){
        var variable_name = root.params[i].name;
        global_and_function_variables.push({variables_name:variable_name, variable_value: variable_name, is_parameter: true });
    }
    module_builder(root.body);
};

const variable_decleration_parser_for_array = (root) => {
    for(var i =0; i<root.declarations.length; i++){
        var variable_name = root.declarations[i].id.name;
        var value = module_builder(root.declarations[i].init);
        let local_loc = root.declarations[i].loc.start.line -1;
        let new_line_to_add = 'let ' + variable_name+' ' + value ;
        global_and_function_variables.push({variables_name : variable_name,variable_value:value, is_parameter: false });
        
        codeSoFar[local_loc]= ({line:new_line_to_add, need_to_delete:true, is_it_statement:false, color:1 });
    }return;};

const expression_statement_parser = (root) => {
    let variable_name = root.expression.left.name;
    let value = module_builder(root.expression.right);
    let local_loc = root.loc.start.line -1;
    let operator = root.expression.operator;
    let new_line_to_add = variable_name +operator +  value + ';';
    let index_of_var = global_and_function_variables.findIndex((x)=>x.variables_name ===variable_name);
    if(global_and_function_variables[index_of_var].is_parameter===true) { global_and_function_variables[index_of_var] = {variables_name: variable_name, variable_value: value, is_parameter: true };codeSoFar[local_loc]= ({line:new_line_to_add, need_to_delete:false, is_it_statement:false, color:1 });}
    else { global_and_function_variables[index_of_var] = {variables_name: variable_name, variable_value: value, is_parameter: false };codeSoFar[local_loc]= ({line:new_line_to_add, need_to_delete:true, is_it_statement:false, color:1 });}
    return;};


const return_statement_parser = (root) => {
    let local_loc = root.loc.start.line -1;
    let to_return = module_builder(root.argument);
    let new_line_to_add = 'return ' + to_return + ';'  ;
    codeSoFar[local_loc]= ({line:new_line_to_add, need_to_delete:false, is_it_statement:false, color:1 });
    return;
};

const if_statement_parser = (root) => {
    var test1 = module_builder(root.test);
    let local_loc = root.loc.start.line -1; 
    let line_to_enter = 'if(' + test1 + '){';
    var color_to_print=1;
    let my_string = string_of_input + test1;
    let eval_condition_true_or_false = eval(my_string);
    if(eval_condition_true_or_false===false){ color_to_print = 3;}
    else if(eval_condition_true_or_false === true){color_to_print=2;}
    codeSoFar[local_loc]= ({line:line_to_enter, need_to_delete:false, is_it_statement:true, color: color_to_print });
    let ksdmvk = [...global_and_function_variables];
    module_builder(root.consequent);
    global_and_function_variables = [...ksdmvk];
    module_builder(root.alternate);
    global_and_function_variables = [...ksdmvk];
    return;
};

const while_statement_parser = (root) => {
    var test = module_builder(root.test);
    let local_loc = root.loc.start.line -1;
    let line_to_enter = 'while(' + test + '){' ;
    var color_to_print=1;
    let my_string = string_of_input + test;
    let eval_condition_true_or_false = eval(my_string);
    if(eval_condition_true_or_false===false){ color_to_print = 3;} else if(eval_condition_true_or_false === true){color_to_print=2;}
    codeSoFar[local_loc]= ({line:line_to_enter, need_to_delete:false, is_it_statement:false, color: color_to_print });
    let ksdmvk = [...global_and_function_variables];
    global_and_function_variables = [...ksdmvk];
    program_helper(root.body); //may be sending to module helper
    global_and_function_variables = [...ksdmvk];
    return;
};



/*
const Unary_Expression_parser = (root) => {
    var x = root.operator;
    var y = module_builder(root.argument);
    var s= x+ y;
    return s;
};
*/
/*
const symbolic_subs = () => {
    for(var i =0; i< table_array.length; i++){
        if(table_array[i].type === 'VariableDeclaration' && !search_if_global_or_input(table_array[i])){
            evaluate_and_substitute(table_array[i]);
        }
    }

};


const evaluate_and_substitute = (var_to_be_evaluated) => {
    //needs to evaluate the local value, and change all of his performance in the code with it's value
};


const search_if_global_or_input = (var_to_be_searched) => {
    for(var i =0; i< global_and_function_variables.length; i++){
        if(global_and_function_variables.name === var_to_be_searched.name){
            return true;
        }
    }
    return false;
};
*/ //aviv
//reads the loc parse and saves his location


/*
const update_expression_parser = (root) => {
    var name = root.argument.name;
    var operator= root.operator;
    var total_name = name+ operator; 
    var new_object_func_decl = new_line_object(root.loc.start.line, 'update Statement', total_name ,' ',' '); 
    table_array.push(new_object_func_decl);
    return;
};

*/

/*
//need to be fixed
const for_statement_parser = (root) => {
    module_builder(root.init);
    //var test = module_builder(root.test);
    var x = root.test.range;
    var test = string_range_code.substring(x[0], x[1]);
    module_builder(root.update);
    var new_object_func_decl = new_line_object(root.loc.start.line, 'for statement',' ',test,' ');
    table_array.push(new_object_func_decl);
    program_helper(root.body);
    return;
};
*/

/* unused
const assignment_expression_parser = (root) => {
    var right = module_builder(root.expression.right);
    var name = root.expression.left;
    var new_object_func_decl = new_line_object(root.loc.start.line, "assignment statement", name ," ",right);   
    table_array.push(new_object_func_decl);
    return;
};
*/

/* unsued
const Member_Expression_parser = (root) => {
    
    var x = root.range;
    var y = string_range_code.substring(x[0], x[1]);
    return y;
    

    
    //return ;
};
*/


export {parseCode,codeSoFar, global_and_function_variables, returnCode};
