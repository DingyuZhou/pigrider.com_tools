//set path
ZeroClipboard.setMoviePath('http://davidwalsh.name/demo/ZeroClipboard.swf');
//create client
var clip = new ZeroClipboard.Client();
//event
clip.addEventListener('mousedown',function() {
	clip.setText(document.getElementById('output1').value);
});
clip.addEventListener('complete',function(client,text) {
	alert('copied:\n\n' + text + '\n to clipboard.');
});
//glue it to the button
clip.glue('copy');