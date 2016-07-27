(function( $ ) {
	
	var records={};
	var columnMap = [];
	var totalQuery = 0;
	var totalRec = 0;
	var totalPages = 0;
	var page = 0;
	var currPage = 1;
	var table;

	function camelize(str) {
		return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
				return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
			}).replace(/\s+/g, '');
	}
	
	function getData(url,filters,perPage,page, handleData) {
		
		// data do .ajax só aceita uma string ou um array, pesquisar uma soluçõa mais elegante pra enviar pro controller
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
	
	function mapTable(element) {
		tableHead = $(element).find("tr").first().find("th");

		$.each(tableHead, function() {
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
	
	function fillTable(element) {
		var lineMap = []
		tablebody = $(element).children("tbody");
		var newLine;

		$(tablebody).empty();
		
		$.each(records["records"], function (key, value) {
			$.each(value, function(key,value) {
				indexColumn = $.inArray(key,columnMap);
				lineMap[indexColumn] = value;
			});
			stampLine(tablebody,lineMap);
		});
	}

	function createFoot(element)
	{
		if ($(element).find("tfoot").length < 1)
			$(element).append("<tfoot></tfoot>");
		
		footer = $(element).find("tfoot");
		
		if ($(footer).find("th").find("#pagination").length < 1)
			$(footer).append("<tr><th colspan=\""+$(element).find("thead").find("th").length+"\"><div id=\"pagination\"></div></th></tr>");
		
		footerCel = $(footer).find("th").find("#pagination");
		
		if ($(footerCel).find("#anterior").length < 1)
			$(footerCel).append("<div id=\"anterior\"><a data-page=\""+(page-1)+"\" >Anterior</a></div>");
		
		$(footerCel).find("#pagesLinks").remove();
		
		pagesLinks = "<div id=\"pagesLinks\"><ul>";
		
		for(i=1;i<=totalPages;i++)
		{
			pagesLinks+= "<li><a data-page=\""+i+"\" >"+i+"</a></li>";
		}
		
		if ($(footerCel).find("#pagesLinks").length < 1)
			pagesLinks+= "</ul></div>";
		
		$(footerCel).append(pagesLinks);
		
		if ($(footerCel).find("#proxima").length < 1)
			$(footerCel).append("<div id=\"proxima\"><a data-page=\""+(page+1)+"\" >Próxima</a></div>");
		
		$(footerCel).find("#pagesLinks").find("a").on("click", changePage);
	}
	
	function loadTable(obj,page) {
		
		$(obj).find("tbody").find("tr").remove();
		
		getData(settings.url, settings.filters, settings.perPage, page, function(output) {
			records = output;
		});
		
		totalQuery = records["queryRecordCount"];
		totalRec = records["totalRecordCount"];
		totalPages = Math.ceil(totalRec / totalQuery);
		
		mapTable(obj);
		fillTable(obj);
		createFoot(obj);
	}
	
	function changePage()
	{
		var page = $(this).attr('data-page');
		loadTable(table,page);
	}
	
	$.fn.AjaxFilterTable = function( options ) {
		
		settings = $.extend({
			url          : null,
			filters      : null,
			perPage      : '10'
		}, options);
		
		console.clear();
		
		return this.each( function() {
			
			table = this;
			loadTable(table);
			
        });
	}
} ( jQuery ));