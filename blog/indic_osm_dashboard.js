var language_table_id = "#tablepress-20";
var language_status = {}
var languages ={"brx":"Bodo","doi":"Dogri","kok":"Konkani ","mai":"Maithili","mni":"Manipuri","sa":"Sanskrit","ur":"Urdu","sd":"Sindhi","pa":"Punjabi","or":"Odia","ne":"Nepali","as":"Assamese","bn":"Bengali","ks":"Kashmiri","kn":"Kannada", "hi":"Hindi","ml":"Malayalam","ta":"Tamil","mr":"Marathi","gu":"Gujarati","te":"Telugu"}
var lang_keys = Object.keys(languages);

//http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html
function GetURLParameter(sPageURL, sParam){
    var query_variable = sPageURL.split('?');
    var sURLVariables = query_variable[1].split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

function addLanguageStatus(result){
    var data = result.data;
    var all_count = 0;
    var nodes_count = 0;
    var ways_count = 0;
    var relations_count = 0;
    var url = result['url'];
    var name_key = GetURLParameter(url, "key");
    var lang = name_key.split(':')[1];
    var language = languages[lang];

    for (var i = 0; i < data.length; i++) { 
        data_item = data[i];
        if(data_item["type"]=="all"){
            all_count = data_item["values"];
        }
        if(data_item["type"]=="nodes"){
            nodes_count = data_item["values"];            
        }
        if(data_item["type"]=="ways"){
            ways_count = data_item["values"];            
        }
        if(data_item["type"]=="relations"){
            relations_count = data_item["values"];            
        }
    }
    language_status = {"Language":language, "Status":lang, "All":all_count, "Nodes":nodes_count, "Ways":ways_count,"Relations":relations_count };
    data_row =[language, lang, all_count,nodes_count,ways_count,relations_count];
    if ( jQuery.fn.dataTable.isDataTable( language_table_id ) ) {
        var table = jQuery(language_table_id).DataTable();
        var node = table.row.add(data_row).draw().node();
        table.order([ 2, 'desc' ] ).draw();
        //jQuery(node).css( 'color', 'red' ).animate( { color: 'black' } );

    }else{
        console.log("DataTable is not initialized yet");
        return;
    }
}

jQuery(document).ready(function($){
    for (var i = 0; i < lang_keys.length; i++) { 
        lang_code =  lang_keys[i];
        console.log(lang_code);
        lang = languages[lang_code];
        console.log(lang);
        jQuery.getJSON("https://taginfo.openstreetmap.org/api/4/key/stats?key=name:"+lang_code+"&callback=?", function(result){
                //console.log(result);
                addLanguageStatus(result);
        });
    }
});