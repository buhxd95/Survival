var jogar = $('#jogar')[0];
var script;

document.addEventListener("keydown", function(evento) {
	if(evento.keyCode == 13 && !$('#canvas').length)
  		jogar.click();
});

function getjs(url){
	script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
	$("head")[0].appendChild(script);
}

jogar.onclick = function(){
	$('body').children().not('script:eq(1)').hide(800);
	$('body')[0].style = 'margin:1px';
	var canv = $('<canvas id="canvas" style="border:1px solid black;"></canvas>');
	canv[0].width = 50;
	canv[0].height = 50;
	$('body').append(canv);
	var mw = window.innerWidth - 4;
	var mh = window.innerHeight - 4;
	var parar = false;

	var s = setInterval(function(){

		if(canv[0].width < mw)
			canv[0].width += mw/mh+1;
		else
			parar = true;
		if(canv[0].height < mh)
			canv[0].height += 1;
		else if(parar){
			getjs("documentos/js/jogo.js");
			
			clearInterval(s);
		}
	},1);
    return false;
}