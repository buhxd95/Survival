function init(){

    document.body.setAttribute("bgcolor","black");
    var canvas = $("#canvas");
    var ctx = canvas[0].getContext("2d");
    var w = canvas[0].width;
    var h = canvas[0].height;
    var balas = {};
    var inimigos = {};
    var atirou = false;
    var bala_index = 0;
    var zumbis_index = 0;
    var contar = 0;
    var roundAtual = 1;
    var zumbisMortos = 0;
    var pause = false;
    var jogarNovamente = false;
    var gogogo = false;
    var hpPorRound = 5;
    var sair = false;
    var info = false;
    var contar = 0;

    var teclas = {
        tecla65: false,
        tecla37: false,
        tecla68: false,
        tecla39: false,
        tecla87: false,
        tecla38: false,
        tecla83: false,
        tecla40: false
    };

    var jogador = { //objeto jogador
        x: Math.round(w/2-25),
        y: Math.round(h/2-50),
        imagem: "documentos/imagens/leste1.png",
        hp:100,
        direcao: 4,
        vivo: function(){return this.hp>0  ? true : false;},
        andar: function() {
            var parado = true;
            if(teclas.tecla65 || teclas.tecla37){//tecla A ou seta pra esquerda
                for(i=0;i<(roundAtual>=20 && jogador.hp>=100+hpPorRound*roundAtual*0.8 ? 20 : 10);i++){//a partir do round 20 se o jogador estiver com a vida inicial mais 80% do hp bonus por round, sua velocidade dobrará
                    if(jogador.x>0)
                        jogador.x -= 1;
                }
                parado = false;
                jogador.direcao = 4;
            }
            if(teclas.tecla68 || teclas.tecla39){//tecla D ou seta pra direita
                for(i=0;i<(roundAtual>=20 && jogador.hp>=100+hpPorRound*roundAtual*0.8 ? 20 : 10);i++){//em vez de adicionar a velocidade tudo de uma vez, faremos um loop, adicionando uma por uma por segurança, para nao extrapolar o canvas
                    if(jogador.x < w-50)
                        jogador.x += 1;
                }
                parado = false;
                jogador.direcao = 2;
            }
            if(teclas.tecla87 || teclas.tecla38){//tecla W ou seta pra cima
                for(i=0;i<(roundAtual>=20 && jogador.hp>=100+hpPorRound*roundAtual*0.8 ? 20 : 10);i++){
                    if(jogador.y > 0)
                        jogador.y -= 1;
                }
                parado = false;
                jogador.direcao = 1;

            }
            if(teclas.tecla83 || teclas.tecla40){//tecla S ou seta pra baixo
                for(i=0;i<(roundAtual>=20 && jogador.hp>=100+hpPorRound*roundAtual*0.8 ? 20 : 10);i++){
                    if(jogador.y < h-85)
                        jogador.y += 1;
                }
                parado = false;
                jogador.direcao = 3;

            }

            switch(jogador.direcao) {
                case 1:
                    jogador.imagem = (Math.round(contar/10)%2 || parado) ? "documentos/imagens/norte1.png" : "documentos/imagens/norte2.png";//a cada 2 contagens, a imagem troca para simular movimento
                    break;
                case 2:
                    jogador.imagem = (Math.round(contar/10)%2 || parado) ? "documentos/imagens/leste1.png" : "documentos/imagens/leste2.png";
                    break;
                case 3:
                    jogador.imagem = (Math.round(contar/10)%2 || parado) ? "documentos/imagens/sul1.png" : "documentos/imagens/sul2.png";
                    break;
                case 4:
                    jogador.imagem = (Math.round(contar/10)%2 || parado) ? "documentos/imagens/oeste1.png" : "documentos/imagens/oeste2.png";
                    break;
            }
        }
    };

    function atirar(i,x,y,j){//função para criar objetos dentro do objeto balas
        a = {
            y:y,
            x:x,
            id:i,
            direcao:j
        };
        balas[i] = a;
    }

    function zumbis(i,x,y,j){//função para criar objetos dentro do objeto inimigos
        a = {
            y:y,
            x:x,
            id:i,
            direcao:j,
            hp:calcRound(roundAtual).vi,
        };
        inimigos[i] = a;
    }

    document.onkeydown = function(e){//escuta por algum evento de tecla
        teclas['tecla'+e.keyCode] = true;
        if(e.keyCode == 32){//barra de espaço
            if(jogador.vivo()){//checar se o jogador esta vivo, e em que direçao esta, para desenharmos a bala de acordo
                atirou = true;
                if(jogador.imagem.indexOf("oeste") != -1)
                    atirar(bala_index,jogador.x-7,jogador.y+27,jogador.imagem);
                if(jogador.imagem.indexOf("leste") != -1)
                    atirar(bala_index,jogador.x+50,jogador.y+27,jogador.imagem);
                if(jogador.imagem.indexOf("norte") != -1)
                    atirar(bala_index,jogador.x+21.5,jogador.y-8,jogador.imagem);
                if(jogador.imagem.indexOf("sul") != -1)
                    atirar(bala_index,jogador.x+21,jogador.y+30,jogador.imagem);
            }
        }
        if(e.keyCode == 80)//tecla P para pausar
            pause = !pause;
        if(e.keyCode == 89)//tecla y para mais info
            info = !info;
        if(e.keyCode == 27 && (!jogador.vivo() || pause))//na tela de game over, apertar Esc para sair
            sair = true;
        if(e.keyCode == 71)
            jogarNovamente = true;//apertar espaço reinicia o jogo
        if(e.keyCode == 82 && e.repeat != undefined)
            gogogo = true;//apertar R acelera a velocidade dos zumbis
    };

    $(document).keyup(function(e) {
        if(e.keyCode == 82)
            gogogo = false;
        teclas['tecla'+e.keyCode] = false;
    });

    function reajustarCanvas(){//reajustar canvas ao tamanho da janela
        canvas[0].width = window.innerWidth - 4;//existe uma diferença de 4px entre o tamanho da janela e o tamanho maximo do canvas
        canvas[0].height = window.innerHeight - 4;
        w = canvas[0].width;
        h = canvas[0].height;
    }
    reajustarCanvas();

    window.addEventListener("resize", function(){//pedir ao navegador para ouvir qualquer mudança no tamanho da janela e aplicar a função acima caso verdadeiro
        reajustarCanvas();
    });

    function aleat(max, min){//calcular um numero aleatorio entre 2 numeros quaisquer
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function calcRound(round){//calcular informaçoes sobre mudanças em cada round
        var nz = Math.round(6*Math.pow(1.2,round-1)); //numero de zumbis no round de parametro, incremento de 20% por round
        var vi = Math.round(50*Math.pow(1.15,round-1));//hp dos zumbis no round de parametro, incremento de 15% por round
        var nzt = 0;
		var c = {};
        for(i=0;i<round;i++){
            var x = Math.round(6*Math.pow(1.2,i)); //fazer uma iteraçao em cada round e concatena-los para saber o numero total de zumbis no round de parametro
            nzt += x;
        }
        c.nz = nz;
        c.vi = vi;
        c.nzt = nzt;
        return c;	//criar um objeto para armazenar e manipular informaçoes de maneira mais facil e objetiva
    }

    function posicaoAleat(){//calcular uma posição aleatorio de respawn do zumbi fora do canvas, para nao "brotarem"
        var x = aleat(-100,w+100);
        var z = [-180,w+180];
        var pos = {};
        if(-50<x<0 || w<x<w+50 || 0<x<w)
            y = z[aleat(-1,2)];
        if(x<0 || x>w)
            y = aleat(-180,h+180);
        pos.x = x;
        pos.y = y;
        return pos; //após todos os calculos, retorna um objeto com x e y
    }

    var respawn = setInterval(function(){//um intervalo aleatorio de respawn de zumbis, se o numero total de zumbi criados, for igual ao numero total de zumbis até tal round
        if(calcRound(roundAtual).nzt < zumbis_index || !document.hasFocus() || pause || !jogador.vivo()){//se a pagina não estiver focada, e se o jogador estiver morto
            return;
        }

        var k = posicaoAleat();console.log('x:',k.x,'y:',k.y);
        zumbis(zumbis_index,k.x,k.y,'documentos/imagens/i_leste1.png');//criaçao de zumbis no objeto inimigos
        zumbis_index += 1;	//indice de cada zumbi dentro do objeto inimigos
    },aleat(1000,2000));

    function distancia(e1,e2){//teorema de pitagoras para calcular a distancia entre dois pontos num plano cartesiano
        return Math.sqrt(Math.pow((e1.x - e2.x),2) + Math.pow((e1.y - e2.y),2));
    }

    function desenharFundo(){//desenhar o fundo de concreto em que o personagem anda
        var rua = new Image(100,100);
        rua.src = "documentos/imagens/concreto.jpg";
        var mapax = 0;
        var mapay = 0;
        for(i=0;i<w/100;i++){//iteraçoes para desenhar os blocos em cada parte do mapa de 100 em 100 x e y: (100,100) (100,200) (200,200) ...
            for(j=0;j<h/100;j++){
                ctx.drawImage(rua,mapax,mapay);
                mapay += 100;
            }
            mapay = 0;
            mapax += 100;
        }
    }

    function resetar(){//resetar todos os variaveis e objetos do ultimo jogo, para começar um novo
        balas = {};
        inimigos = {};
        pause = false;
        sair = false;
        info = false;
        bala_index = 0;
        zumbis_index = 0;
        contar = 0;
        roundAtual = 1;
        zumbisMortos = 0;
        jogador = {
            x: Math.round(w/2-25),
            y: Math.round(h/2-50),
            imagem: "documentos/imagens/oeste1.png",
            hp:100,
            vivo: function(){return this.hp>0  ? true : false;}
        };
        jogarNovamente = false;
    }

    function desenhar(){
        contar++; //contador de intervalos desenhar

        if(sair && (!jogador.vivo() || pause)){	//se o jogador apertar Esc quando morto
			sair = false;
             var confirmar = confirm("Tem certeza que deseja sair?");
                if(confirmar){
                    resetar();
            		clearInterval(respawn);    //resetar as variaveis pra um futuro proximo jogo e cancelar o intervalo de respawn
            		$("#canvas").remove();
            		$('body').children().show(800);  //apagar o canvas e mostrar o html original
            		document.body.setAttribute("bgcolor","white");
            		$('body')[0].style = 'margin:8px';
				}
        }

        ctx.font = '20px Times New Roman';
        ctx.fillStyle = 'white';
        if((pause || !document.hasFocus()) && jogador.vivo()){//janela sem foco ou botao de pausa pressionado, vai parar o jogo se o jogador estiver vivo
            ctx.fillText("Jogo Pausado",w/2-50,h/2-20); //escrever o estatus do jogo
            ctx.fillText('Aperte Esc para sair',80,20);
            ctx.fillText('Aperte G para reiniciar',80,50);
            if(jogarNovamente){
                jogarNovamente = false;
                var confirmar = confirm("Tem certeza que deseja reiniciar?");
                if(confirmar)
                    resetar();
            }
            else
                return;
        }

        ctx.clearRect(0,0,w,h); //limpar canvas e desenhar objetos em outra posição dando impressao de movimento
        desenharFundo();

        if(!jogador.vivo()){ //se jogador morreu, escrever informaçoes na tela e opçoes para sair
            ctx.fillStyle = 'red';
            ctx.font = '50px Times New Roman';
            ctx.fillText('Game Over',w/2-120,h/3);
            ctx.font = 'bold 15px Times New Roman';
            ctx.fillText('Você Sobreviveu '+roundAtual+' Rounds',w/2-85-5,h/3+20);
            ctx.fillText('Kills: '+zumbisMortos,w/2-35,h/3+40);
            ctx.fillStyle = 'white';
            ctx.fillText('Aperte G para jogar novamente',5,15);
            ctx.fillText('ou Esc para sair',5,32);
            if(!jogarNovamente)
                return;	//se o jogador nao clicar pra jogar denovo, pare o jogo e escreva informaçoes, senao reinicia as variaveis e começamos denovo
            else
                resetar();
        } else {
            jogador.andar();
        }

        var img = new Image();
        img.src = jogador.imagem;
        ctx.drawImage(img,jogador.x,jogador.y); //criaçao do jogador

        if(atirou===true){//clicando espaço (atirando), incrementa mais 1 ao contador de balas
            atirou = false;
            bala_index++;
        }

        $.each(balas,function(i){//fazer um loop dentro do indice de balas
            ctx.fillStyle = 'black';
            if(balas[i].x > 0 && balas[i].direcao.indexOf("oeste") != -1){//checar se as balas estao dentro do canvas, e atirar de acordo com a posiçao do boneco
                ctx.beginPath();
                ctx.fillRect(balas[i].x, balas[i].y, 7, 0.65);		//criar balas com cada indice dentro do objeto
                balas[i].x -= 20;		//velocidade de 20 a cada desenhar
            }
            if(balas[i].x < w && balas[i].direcao.indexOf("leste") != -1){
                ctx.beginPath();
                ctx.fillRect(balas[i].x, balas[i].y, 7, 0.65);
                balas[i].x += 20;
            }
            if(balas[i].y > 0 && balas[i].direcao.indexOf("norte") != -1){
                ctx.beginPath();
                ctx.fillRect(balas[i].x, balas[i].y, 0.65, 7);
                balas[i].y -= 20;
            }
            if(balas[i].y < h && balas[i].direcao.indexOf("sul") != -1){
                ctx.beginPath();
                ctx.fillRect(balas[i].x, balas[i].y, 0.65, 7);
                balas[i].y += 20;
            }
            $.each(inimigos,function(z){//loop dentro de loop, para usar dois indices (i,z) para checar colisao de balas em zumbis
                if(balas[i] !== undefined){//se existe balas dentro do objeto
                    if(balas[i].x > 0 && balas[i].x < w && balas[i].y > 0 && balas[i].y < h){//checar se balas estao dentro do canvas, pra nao danificar zumbis fora da tela
                        if(balas[i].x > inimigos[z].x+8 && balas[i].x < inimigos[z].x+40 && balas[i].y > inimigos[z].y && balas[i].y+2 < inimigos[z].y+83){//checando colisao entre os dois elementos
                            inimigos[z].hp -= (roundAtual>=15 && jogador.hp>=100+hpPorRound*14) ? (20) : (10);//se há colisao, zumbi perderá hp. No round 15, se o jogador tiver 100% da vida padrao + bonus, ganhara o dobro de dano em zumbis
                            delete balas[i];		//deletar balas pra nao matar multiplos zumbis enfileirados
                            if(inimigos[z].hp <= 0){	//checar hp do inimigo para ver se deve morrer
                                delete inimigos[z];		//deletar o que não tem hp
                                zumbisMortos++;			//contador de zumbis mortos
                                if(calcRound(roundAtual).nzt == zumbisMortos){ //numero de zumbis mortos deve ser igual ao numero de zumbis totais até aquele round, para poder avançar ao proximo round
                                    roundAtual++;
                                    jogador.hp += hpPorRound;	//jogador ganha um bonus de hp, por sobreviver aquele round
                                }
                            }
                        }
                    }
                }
            });
        });

        $.each(inimigos,function(i){//movimento dos zumbis
            var img2 = new Image();
            img2.src = inimigos[i].direcao;
            ctx.drawImage(img2,inimigos[i].x,inimigos[i].y);//desenhar cada um no canvas

            if(distancia(jogador,inimigos[i]) < 10) //checar se a distancia entre o jogador e o zumbi é baixa, se sim, o jogador perderá vida
                jogador.hp -= (roundAtual>=20) ? (0.2) : (0.1); //a partir do round 20, a força do zumbi dobra

            if(roundAtual<20 && !gogogo){//se o round é menor que 20, o inimigo anda 1 dimensão por vez (x,y)
                if(inimigos[i].x < jogador.x && (inimigos[i].x !== jogador.x)){
                    inimigos[i].direcao = (contar%2==0) ? ("documentos/imagens/i_leste1.png") : ("documentos/imagens/i_leste2.png");//a cada 2 contagens, a imagem troca para simular movimento
                    inimigos[i].x += (roundAtual>=10) ? 0.5 : 0.25;//a partir do round 10, a velocidade dos zumbis dobra
                }
                else if(inimigos[i].y < jogador.y  && (inimigos[i].y !== jogador.y)){
                    inimigos[i].direcao = (contar%2==0) ? ("documentos/imagens/i_sul1.png") : ("documentos/imagens/i_sul2.png");
                    inimigos[i].y += (roundAtual>=10) ? 0.5 : 0.25;
                }
                else if(inimigos[i].x > jogador.x  && (inimigos[i].x !== jogador.x)){
                    inimigos[i].direcao = (contar%2==0) ? ("documentos/imagens/i_oeste1.png") : ("documentos/imagens/i_oeste2.png");
                    inimigos[i].x -= (roundAtual>=10) ? 0.5 : 0.25;
                }
                else if(inimigos[i].y > jogador.y  && (inimigos[i].y !== jogador.y)){
                    inimigos[i].direcao = (contar%2==0) ? ("documentos/imagens/i_norte1.png") : ("documentos/imagens/i_norte2.png");
                    inimigos[i].y -= (roundAtual>=10) ? 0.5 : 0.25;
                }
            }
            else if(roundAtual>=20 || gogogo){//se é maior que 20, o zumbi anda na diagonal
                if(inimigos[i].x < jogador.x && (inimigos[i].x !== jogador.x)){
                    inimigos[i].direcao = (contar%2==0) ? ("documentos/imagens/i_leste1.png") : ("documentos/imagens/i_leste2.png");
                    inimigos[i].x += 1;
                }
                if(inimigos[i].y < jogador.y  && (inimigos[i].y !== jogador.y)){
                    inimigos[i].direcao = (contar%2==0) ? ("documentos/imagens/i_sul1.png") : ("documentos/imagens/i_sul2.png");
                    inimigos[i].y += 1;
                }
                if(inimigos[i].x > jogador.x  && (inimigos[i].x !== jogador.x)){
                    inimigos[i].direcao = (contar%2==0) ? ("documentos/imagens/i_oeste1.png") : ("documentos/imagens/i_oeste2.png");
                    inimigos[i].x -= 1;
                }
                if(inimigos[i].y > jogador.y  && (inimigos[i].y !== jogador.y)){
                    inimigos[i].direcao = (contar%2==0) ? ("documentos/imagens/i_norte1.png") : ("documentos/imagens/i_norte2.png");
                    inimigos[i].y -= 1;
                }
            }
        });

        switch(true){//pintar o hp de cores diferentes, só para efeito visual
            case jogador.hp>60:					//hp maior que 60 é pintado de verde
                ctx.fillStyle = '#00FF06';
                break;
            case jogador.hp<60 && jogador.hp>25://hp entre 60 e 25 é pintado de amarelo
                ctx.fillStyle = '#FFFF00';
                break;
            case jogador.hp<25:					//hp menor que 25 é pintado de vermelho
                ctx.fillStyle = '#FF0000';
                break;
        }
        ctx.fillText("HP: "+Math.round(jogador.hp),5,20); //escrever o hp do jogador

        ctx.fillStyle = '#FF0000';
        ctx.font = '75px Times New Roman';
        ctx.fillText(roundAtual,5,h-10);	//escrever o round atual do jogador

		if(info && !pause){//informaçoes adicionais fora do pause
            ctx.fillStyle = 'red';
            ctx.fillText("Kills: "+zumbisMortos,5,50);
            ctx.fillText("Kills faltando: "+(calcRound(roundAtual).nzt-zumbisMortos),5,80);
        }
    }

    setInterval(desenhar, 10);	//colocar a função em intervalo infinitamente, para que de impressão de movimento
}
init();
