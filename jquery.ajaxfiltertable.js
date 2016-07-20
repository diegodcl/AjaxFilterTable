(function( $ ) {
	
	var records={};
	var columnMap = [];
	var totalQuery = 0;
	var totalRec = 0;
	var totalPages = 0;
	var page = 0;
	
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
	
	function changePage(page)
	{
		//
	}
	
	function createFoot(element)
	{
		if ($(element).find("tfoot").length < 1)
			$(element).append("<tfoot></tfoot>");
		
		footer = $(element).find("tfoot");
		
		if ($(footer).find("th #pagination").length==0)
			$(footer).append("<tr><th colspan=\""+$(element).find("thead th").length+"\"><div id=\"pagination\"></div></th></tr>").find("th #pagination");
		
		footerCel = $(footer).find("th #pagination");
		$(footerCel).append("<a href=\"\">Anterior</a>");
		
		for(i=1;i<=totalPages;i++)
		{
			pageLink = $(footerCel).append("<a data-ajaxfiltertable-page=\""+i+"\" >"+i+"</a>");
			$(pageLink).on("click", changePage);
		}

		$(footerCel).append("<a href=\"\">Próxima</a>");
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
