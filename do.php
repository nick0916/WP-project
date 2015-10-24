<?php
date_default_timezone_set('Asia/Taipei');
$name = $_POST["name"];
$time =date ("Y.m.d H:i"); 
$message = $_POST["message"];

if($name!=""&&$message!="") 
{

	$text = "<div id=\"contact_message\" class=\"col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1\"><p id=\"myname\">";
	$text .= htmlspecialchars($name);
	$text .= "</p><p id=\"message\">";
	$text .= htmlspecialchars($message);
	$text .= "</p><p id=\"time\">";
	$text .= htmlspecialchars($time);
	$text .= "</p></div>";
    file_put_contents("file.txt", $text, FILE_APPEND);

    echo "test";

    
} 
else
{

	echo "gg";
	echo $name;
	echo $message;

}
?>
