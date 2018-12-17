import $ from 'jquery';
import {parseCode, returnCode} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let input_vactor = $('#input_vector').val();

        parseCode(codeToParse,input_vactor);//builds the new string to be added and sends it to the table
        var string_to_insert;
        var insert_to_table;
        for(var j=0; j<returnCode.length; j++ ){
            switch(returnCode[j].color){
            case 2 : insert_to_table = '<span style="color: Green; ">' + returnCode[j].line + '</span><br>'; break;
            case 3 : insert_to_table = '<span style="color: red; ">' + returnCode[j].line + '</span><br>'; break;
            case 1 : insert_to_table = the_string_to_add(returnCode[j].line); 
            }
            string_to_insert = string_to_insert + insert_to_table + ' ';
        }
        $('#table_data').html(string_to_insert); });
        
});
//adds the string to be added
const the_string_to_add = (the_new_line_to_string) => `<tr> <td> ${the_new_line_to_string} `;
