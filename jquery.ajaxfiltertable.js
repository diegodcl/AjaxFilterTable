(function( $ ) {
	
	var records= {};
	var columnMap = [];
	var totalQuery = 0;
	var totalRec = 0;
	var totalPages = 0;
	var page = 1;
	var currPage = 1;
	var table;

	function camelize(str) {
		return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
				return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
			}).replace(/\s+/g, '');
	}
	
	function getData(url,filters,perPage,page, handleData) {
		
		// data do .ajax só aceita uma string ou um array, pesquisar uma solução mais elegante pra enviar pro controller
		filters["perPage"] = perPage;
		filters["page"] = page;
		
		$.ajax({
		    async: false,
		    url: url,
		    data: filters,
		    dataType: 'json',
		    success: function(data) {
				handleData(data);
		    }
		});
	}
	
	function mapTable() {
		
		tableHead = $(table).find("tr").first();
		
		$.each(settings.buttons, function(index, value)
		{
			$.each(value, function(index, value)
			{
				if ($(tableHead).children('th').eq(value.column).html()!=value.caption)
				{
					var newpos = value.column;
					var newitem = '<th>'+value.caption+'</th>';
					$(tableHead).children('th').eq(newpos).before(newitem);
				}
			});
		});
		
		tableHead = $(table).find("tr").first().find("th");
		$.each(tableHead, function() 
		{
			index = $(this).index();
			title = camelize($(this).html());
			columnMap[index] = title;
		});

	}
	
	function stampLine(element,lineMap) {
		var line = "<tr>";
		
		$.each(lineMap, function(key, value) {
			line += "<td>"+value+"</td>";
		});
		
		line += "</tr>";
		$(element).append(line);
	}
	
	function fillTable() {
		var lineMap = []
		tablebody = $(table).children("tbody");
		var newLine;

		$(tablebody).empty();
		
		$.each(settings.buttons, function (key,value){
			$.each(value, function(key, value){
				//object = "<input type=\"button\" name=\""+value.name+"\" value=\""+value.caption+"\" class=\""+value.class+"\" onclick=\""+value.click+"\" data-receita="++">";
				
				var object = value;
				//var caption = value.caption;
				$.each(records["records"], function (key, value) {
					
					//console.log(value.receita);
					
					newbtn = "<input type=\"button\" name=\""+object.name+"\" value=\""+object.caption+"\" class=\""+object.class+"\" onclick=\""+object.click+"\" data-id=\""+value.receita+"\">";
					
					value[object.caption.toLowerCase()]=newbtn;
				});
			});
		});
		
		$.each(records["records"], function (key, value) {
			$.each(value, function(key,value) {
				indexColumn = $.inArray(key,columnMap);
				lineMap[indexColumn] = value;
			});
			stampLine(tablebody,lineMap);
		});
	}

	function createFoot()
	{
		var tofoot = "";
		
		if ($(table).find("tfoot").length < 1)
			$(table).append("<tfoot></tfoot>");
		
		footer = $(table).find("tfoot");
		
		$(footer).find("tr").remove();
		
		tofoot= "<tr><td colspan=\""+$(table).find("thead").find("th").length+"\">";
		tofoot+= "<ul><li><a data-page=\""+(page-1)+"\" >Anterior</a></li>";

		for(i=1;i<=totalPages;i++)
		{
			tofoot+= "<li><a data-page=\""+i+"\" >"+i+"</a></li>";
		}
		
		tofoot+= "<li><a data-page=\""+(page+1)+"\" >Próxima</a></li></ul></td></tr>";

		$(footer).append(tofoot);
		$(footer).find("td").find("ul>li").find("a").on("click", changePage);
	}
	
	function loadTable(page) {
		
		$(table).find("tbody").find("tr").remove();
		
		getData(settings.url, settings.filters, settings.perPage, page, function(output) {
			records = output;
		});
		
		totalQuery = records["queryRecordCount"];
		totalRec = records["totalRecordCount"];
		totalPages = Math.ceil(totalRec / settings.perPage);
		
		mapTable();
		fillTable();
		createFoot();
	}
	
	function changePage()
	{
		page = eval($(this).attr('data-page'));
		loadTable(page);
	}
	
	$.fn.AjaxFilterTable = function( options ) {
		
		settings = $.extend({
			url          : null,
			buttons      : null, 
			filters      : null,
			perPage      : '10'
		}, options);
		
		console.clear();
				
		return this.each( function() {
			
			table = this;
			loadTable();
			$(table).addClass("ajaxFilterTable");
			
        });
	}
} ( jQuery ));