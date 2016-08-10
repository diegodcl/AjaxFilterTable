# AjaxFilterTable

This Plugin was created by a need for a simple plugin that accepted parameters to query from elements created outside the plugin. It's yet in development and has a lot to evolve.

**Usage:**

```
$("#myTable").AjaxFilterTable({
  url : 'url',
  filters: data
});
```
url: url to the script/controller to request the json<br>
data: array with parameters to send with the request<br>
```
data["start_date"] = $("select[name='start_date']").val();<br>
data["end_date"] = $("select[name='end_date']").val();<br>
data["name"] = $("input[name='name']").val();<br><br>
```
**Json format must return like:**<br>
```
{<br>
  "records":<br>
            [
              {
                "startDate":"07\/08\/2016",
                "endDate":"07\/08\/2016",
                "name":"Diego Leit\u00e3o"
              }
            ],
  "queryRecordCount":10,
  "totalRecordCount":36
}
```
The Keys of "records" must be like the text content<th> camelized with no spaces.<br><br>
```
<th>Start Date</th> = startDate
<th>End Date</th> = endDate
<th>Name</th> = name
```

**Next steps:**<br><br>

Pagination - 90% ready<br>
Create Custom elements in cells<br>
Search Box<br>
Sorting<br>
