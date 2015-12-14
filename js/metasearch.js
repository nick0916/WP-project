function metasearch()
{
search($('#all_from :selected').text(),$('#all_to :selected').text(),0,$('#all_time :selected').text(),0);
selectitem($('#all_from').val(),$('#all_to').val(),$('#all_time').val(),$('#all_from :selected').text(),$('#all_to :selected').text());
//bus_time();

$('#thsr_from :selected').text() = $('#all_from :selected').text();
$('#thsr_to :selected').text() = $('#all_to :selected').text();

}