(function( $ ) {
	
	var records={};
	var columnMap = [];
	var totalQuery = 0;
	var totalRec = 0;
	var totalPages = 0;
	var page = 0;
	var currPage = 1;
	
	
	function camelize(str) {
		return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
				return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
			}).replace(/\s+/g, '');
	}
	
	function getData(url,filters,handleData) {
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
	
	function changePage()
	{
		//console.log($(this).html());
		//console.log("page "+$(this).attr('data-page'));
		
		currPage = ($(this).attr('data-page') * recPerPage) - settings.
		
		var page $(this).attr('data-page')
		
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
		
		//if ($(footerCel).find("#pagesLinks").length < 1)
			pagesLinks = "<div id=\"pagesLinks\"><ul>";
		
		for(i=1;i<=totalPages;i++)
		{
			//pageLink = $(footerCel).append("<a data-page=\""+i+"\" >"+i+"</a>");
			pagesLinks+= "<li><a data-page=\""+i+"\" >"+i+"</a></li>";
		}
		
		if ($(footerCel).find("#pagesLinks").length < 1)
			pagesLinks+= "</ul></div>";
		
		$(footerCel).append(pagesLinks);
		
		//$(footerCel).find("#pagesLinks").find("ul").append(pagesLinks);
		
		if ($(footerCel).find("#proxima").length < 1)
			$(footerCel).append("<div id=\"proxima\"><a data-page=\""+(page+1)+"\" >Próxima</a></div>");
		
		//console.log($(footerCel).find("#pagesLinks").html());
		
		$(footerCel).find("#pagesLinks").find("a").on("click", changePage);
	}
	
	$.fn.AjaxFilterTable = function( options ) {
		var settings = $.extend({
			url          : null,
			filters      : null
		}, options);
		
		console.clear();
		
		return this.each( function() {
			
			getData(settings.url,settings.filters, function(output) {
				records = output;
			});
			
			totalQuery = records["queryRecordCount"];
			totalRec = records["totalRecordCount"];
			totalPages = Math.ceil(totalRec / totalQuery);
			
			
			mapTable(this);
			fillTable(this);
			createFoot(this);
			
        });
	}
} ( jQuery ));