function init(){

    "use strict";
    document.body.setAttribute("bgcolor","black");
    var canvas = $("#canvas");
    var ctx = canvas[0].getContext("2d");
    var w = canvas[0].width;
    var h = canvas[0].height;
    var jogo = {
        balas:{},
        inimigos:{},
        reload:false,
        save:false,
        atirou:false,
        jogarNovamente:false,
        sair:false,
        info:false,
        pause:false,
        gogogo:false,
        balas_index:0,
        zumbis_index:0,
        contar:0,
        zumbisMortos:0,
        roundAtual:1,
        hpPorRound:5,
        teclas:{
            65: false,
            37: false,
            68: false,
            39: false,
            87: false,
            38: false,
            83: false,
            40: false
        },
        jogador:{
            x: Math.round(w/2-25),
            y: Math.round(h/2-50),
            imagem: "documentos/imagens/leste1.png",
            hp:100,
            direcao: 4,
        }
    };
    var jogador = {
        vivo: function(){return jogo.jogador.hp>0  ? true : false;},
        andar: function(){
            var parado = true;
            if(jogo.teclas[65] || jogo.teclas[37]){//tecla A ou seta pra esquerda
                for(var a=0;a<(jogo.roundAtual>=20 && jogo.jogador.hp>=100+jogo.hpPorRound*jogo.roundAtual*0.8 ? 4 : 2);a++){
                    if(jogo.jogador.x>0)
                        jogo.jogador.x -= 1;
                }
                parado = false;
                jogo.jogador.direcao = 4;
            }
            if(jogo.teclas[68] || jogo.teclas[39]){//tecla D ou seta pra direita
                for(var e=0;e<(jogo.roundAtual>=20 && jogo.jogador.hp>=100+jogo.hpPorRound*jogo.roundAtual*0.8 ? 4 : 2);e++){
                    if(jogo.jogador.x < w-50)
                        jogo.jogador.x += 1;
                }
                parado = false;
                jogo.jogador.direcao = 2;
            }
            if(jogo.teclas[87] || jogo.teclas[38]){//tecla W ou seta pra cima
                for(var i=0;i<(jogo.roundAtual>=20 && jogo.jogador.hp>=100+jogo.hpPorRound*jogo.roundAtual*0.8 ? 4 : 2);i++){
                    if(jogo.jogador.y > 0)
                        jogo.jogador.y -= 1;
                }
                parado = false;
                jogo.jogador.direcao = 1;
            }
            if(jogo.teclas[83] || jogo.teclas[40]){//tecla S ou seta pra baixo
                for(var o=0;o<(jogo.roundAtual>=20 && jogo.jogador.hp>=100+jogo.hpPorRound*jogo.roundAtual*0.8 ? 4 : 2);o++){
                    if(jogo.jogador.y < h-85)
                        jogo.jogador.y += 1;
                }
                parado = false;
                jogo.jogador.direcao = 3;
            }

            switch(jogo.jogador.direcao) {
                case 1:
                    jogo.jogador.imagem = (Math.round(jogo.contar/10)%2 || parado) ? "documentos/imagens/norte1.png" : "documentos/imagens/norte2.png";
                    break;
                case 2:
                    jogo.jogador.imagem = (Math.round(jogo.contar/10)%2 || parado) ? "documentos/imagens/leste1.png" : "documentos/imagens/leste2.png";
                    break;
                case 3:
                    jogo.jogador.imagem = (Math.round(jogo.contar/10)%2 || parado) ? "documentos/imagens/sul1.png" : "documentos/imagens/sul2.png";
                    break;
                case 4:
                    jogo.jogador.imagem = (Math.round(jogo.contar/10)%2 || parado) ? "documentos/imagens/oeste1.png" : "documentos/imagens/oeste2.png";
                    break;
            }
        }
    };

    sessionStorage.setItem('reset',JSON.stringify(jogo));
    var reset = JSON.parse(sessionStorage.getItem('reset'));

    function atirar(indice,x,y,imagem){//função para criar objetos dentro do objeto balas
        var obj = {
            y:y,
            x:x,
            id:indice,
            direcao:imagem
        };
        jogo.balas[indice] = obj;
    }

    function zumbis(indice,x,y,imagem){//função para criar objetos dentro do objeto inimigos
        var obj = {
            y:y,
            x:x,
            id:indice,
            direcao:'documentos/imagens/i_'+imagem,
            hp:calcRound(jogo.roundAtual).vi,
        };
        jogo.inimigos[indice] = obj;
    }

    document.onkeydown = function(e){//escuta por algum evento de tecla
        jogo.teclas[e.keyCode] = true;
        if(e.keyCode == 32 && jogador.vivo()){//barra de espaço checar se o jogador esta vivo, e em que direçao esta, para desenharmos a bala de acordo
                jogo.atirou = true;
                if(jogo.jogador.imagem.indexOf("oeste") != -1)
                    atirar(jogo.balas_index,jogo.jogador.x-7,jogo.jogador.y+27,jogo.jogador.imagem);
                if(jogo.jogador.imagem.indexOf("leste") != -1)
                    atirar(jogo.balas_index,jogo.jogador.x+50,jogo.jogador.y+27,jogo.jogador.imagem);
                if(jogo.jogador.imagem.indexOf("norte") != -1)
                    atirar(jogo.balas_index,jogo.jogador.x+21.5,jogo.jogador.y-8,jogo.jogador.imagem);
                if(jogo.jogador.imagem.indexOf("sul") != -1)
                    atirar(jogo.balas_index,jogo.jogador.x+21,jogo.jogador.y+30,jogo.jogador.imagem);
        }
        if(e.keyCode == 80)//tecla P para pausar
            jogo.pause = !jogo.pause;
        if(e.keyCode == 89)//tecla y para mais info
            jogo.info = !jogo.info;
        if(e.keyCode == 27 && (!jogador.vivo() || jogo.pause))//na tela de game over, apertar Esc para sair
            jogo.sair = true;
        if(e.keyCode == 71)
            jogo.jogarNovamente = true;//apertar espaço reinicia o jogo
        if(e.keyCode == 82 && e.repeat != undefined)
            jogo.gogogo = true;//apertar R acelera a velocidade dos zumbis
        if(e.keyCode == 82 && jogo.pause)
            jogo.reload = true;
        if(e.keyCode == 83 && jogo.pause)
            jogo.save = true;
    };

    $(document).keyup(function(e) {
        if(e.keyCode == 82)
            jogo.gogogo = false;
        jogo.teclas[e.keyCode] = false;
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
        var nz = Math.round(6*Math.pow(1.1,round-1)); //numero de zumbis no round de parametro, incremento de 20% por round
        var vi = Math.round(50*Math.pow(1.1,round-1));//hp dos zumbis no round de parametro, incremento de 15% por round
        var nzt = 0;
        var c = {};
        for(var i=0;i<round;i++){
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
        var pos = {}, y;
        if(-50<x<0 || w<x<w+50 || 0<x<w)
            y = z[aleat(-1,2)];
        if(x<0 || x>w)
            y = aleat(-180,h+180);
        pos.x = x;
        pos.y = y;
        return pos; //após todos os calculos, retorna um objeto com x e y
    }

    var respawn = setInterval(function(){//um intervalo aleatorio de respawn de zumbis, se o numero total de zumbi criados, for igual ao numero total de zumbis até tal round
        if(calcRound(jogo.roundAtual).nzt <= jogo.zumbis_index || !document.hasFocus() || jogo.pause || !jogador.vivo())//se a pagina não estiver focada, e se o jogador estiver morto
            return;
        var k = posicaoAleat();//console.log('x:',k.x,'y:',k.y);
        zumbis(jogo.zumbis_index,k.x,k.y,'leste1.png');//criaçao de zumbis no objeto inimigos
        jogo.zumbis_index += 1;	//indice de cada zumbi dentro do objeto inimigos
    },aleat(1000,2000));

    function distancia(e1,e2){//teorema de pitagoras para calcular a distancia entre dois pontos num plano cartesiano
        return Math.sqrt(Math.pow((e1.x - e2.x),2) + Math.pow((e1.y - e2.y),2));
    }

    function foraDoCanvas(obj){
        if(obj.x <= 0 || obj.y <= 0 || obj.x >= w || obj.y >= h)
            return true;
    }

    function desenharFundo(){//desenhar o fundo de concreto em que o personagem anda
        var rua = new Image(100,100);
        rua.src = "documentos/imagens/concreto.jpg";
        var mapax = 0;
        var mapay = 0;
        for(var i=0;i<w/100;i++){//iteraçoes para desenhar os blocos em cada parte do mapa de 100 em 100 x e y: (100,100) (100,200) (200,200) ...
            for(var j=0;j<h/100;j++){
                ctx.drawImage(rua,mapax,mapay);
                mapay += 100;
            }
            mapay = 0;
            mapax += 100;
        }
    }

    function desenhar(){
        if(jogo.sair && (!jogador.vivo() || jogo.pause)){	//se o jogador apertar Esc quando morto ou pausado
            jogo.sair = false;
            var confirmar = confirm("Tem certeza que deseja sair?");
            if(confirmar){
                jogo = reset;
                clearInterval(respawn);    //resetar as variaveis pra um futuro proximo jogo e cancelar o intervalo de respawn
                $("#canvas").remove();
                $('body').children().show(800);  //apagar o canvas e mostrar o html original
                document.body.setAttribute("bgcolor","white");
                $('body')[0].style = 'margin:8px';
            }
        }

        ctx.font = '20px Times New Roman';
        ctx.fillStyle = 'white';
        if((jogo.pause || !document.hasFocus()) && jogador.vivo()){//janela sem foco ou botao de pausa pressionado, vai parar o jogo se o jogador estiver vivo
            var confirmar;
            //console.log(reset);
            ctx.fillText("Jogo Pausado",w/2-50,h/2-20); //escrever o estatus do jogo
            ctx.fillText('Aperte Esc para sair',180,20);
            ctx.fillText('Aperte G para reiniciar',180,50);
            ctx.fillText('Aperte S para salvar',400,20);
            ctx.fillText('Aperte R para recarregar',400,50);
            if(jogo.jogarNovamente){
                jogo.jogarNovamente = false;
                confirmar = confirm("Tem certeza que deseja reiniciar?");
                if(confirmar)
                    jogo = reset;//resetar
            }
            else if(jogo.pause && jogo.save){
                jogo.save = jogo.teclas[83] = false;
                confirmar = confirm("Tem certeza que deseja salvar?");
                if(confirmar)
                    localStorage.setItem('save',JSON.stringify(jogo));//salvar
            }
            else if(jogo.pause && jogo.reload){
                jogo.reload = false;
                confirmar = confirm("Tem certeza que deseja recarregar?");
                if(confirmar)
                    jogo = JSON.parse(localStorage.getItem('save'));//recarregar
            }
            else
                return;
        }

        if(!jogador.vivo()){ //se jogador morreu, escrever informaçoes na tela e opçoes para sair
            ctx.fillStyle = 'red';
            ctx.font = '50px Times New Roman';
            ctx.fillText('Game Over',w/2-120,h/3);
            ctx.font = 'bold 15px Times New Roman';
            ctx.fillText('Você Sobreviveu '+jogo.roundAtual+' Rounds',w/2-85-5,h/3+20);
            ctx.fillText('Kills: '+jogo.zumbisMortos,w/2-35,h/3+40);
            ctx.fillStyle = 'white';
            ctx.fillText('Aperte G para jogar novamente',5,15);
            ctx.fillText('ou Esc para sair',5,32);
            if(!jogo.jogarNovamente)
                return;	//se o jogador nao clicar pra jogar denovo, pare o jogo e escreva informaçoes, senao reinicia as variaveis e começamos denovo
            else
                jogo = reset;//JSON.parse(sessionStorage.getItem(jogo));
        } else
            jogador.andar();

        jogo.contar++; //contador de intervalos desenhar
        ctx.clearRect(0,0,w,h); //limpar canvas e desenhar objetos em outra posição dando impressao de movimento
        desenharFundo();

        var img = new Image();
        img.src = jogo.jogador.imagem;
        ctx.drawImage(img,jogo.jogador.x,jogo.jogador.y); //criaçao do jogador

        if(jogo.atirou===true){//clicando espaço (atirando), incrementa mais 1 ao contador de balas
            jogo.atirou = false;
            jogo.balas_index++;
        }

        $.each(jogo.balas,function(i){//fazer um loop dentro do indice de balas
            ctx.fillStyle = 'black';
            if(jogo.balas[i].x > 0 && jogo.balas[i].direcao.indexOf("oeste") != -1){//checar se as balas estao dentro do canvas, e atirar de acordo com a posiçao do boneco
                ctx.beginPath();
                ctx.fillRect(jogo.balas[i].x, jogo.balas[i].y, 7, 1);		//criar balas com cada indice dentro do objeto
                jogo.balas[i].x -= 20;		//velocidade de 20 a cada desenhar
            }
            if(jogo.balas[i].x < w && jogo.balas[i].direcao.indexOf("leste") != -1){
                ctx.beginPath();
                ctx.fillRect(jogo.balas[i].x, jogo.balas[i].y, 7, 1);
                jogo.balas[i].x += 20;
            }
            if(jogo.balas[i].y > 0 && jogo.balas[i].direcao.indexOf("norte") != -1){
                ctx.beginPath();
                ctx.fillRect(jogo.balas[i].x, jogo.balas[i].y, 1, 7);
                jogo.balas[i].y -= 20;
            }
            if(jogo.balas[i].y < h && jogo.balas[i].direcao.indexOf("sul") != -1){
                ctx.beginPath();
                ctx.fillRect(jogo.balas[i].x, jogo.balas[i].y, 1, 7);
                jogo.balas[i].y += 20;
            }
            if(foraDoCanvas(jogo.balas[i]))
                delete jogo.balas[i];

            $.each(jogo.inimigos,function(z){//loop dentro de loop, para usar dois indices (i,z) para checar colisao de balas em zumbis
                if(jogo.balas[i] !== undefined){//se existe balas dentro do objeto
                    if(jogo.balas[i].x > 0
                       && jogo.balas[i].x < w
                       && jogo.balas[i].y > 0
                       && jogo.balas[i].y < h){//checar se balas estao dentro do canvas, pra nao danificar zumbis fora da tela
                        if(jogo.balas[i].x > jogo.inimigos[z].x+8 
                           && jogo.balas[i].x < jogo.inimigos[z].x+40
                           && jogo.balas[i].y > jogo.inimigos[z].y
                           && jogo.balas[i].y+2 < jogo.inimigos[z].y+83){//checando colisao entre os dois elementos
                            jogo.inimigos[z].hp -= (jogo.roundAtual>=15 && jogo.jogador.hp>=100+jogo.hpPorRound*14) ? (20) : (10);//se há colisao, zumbi perderá hp. No round 15, se o jogador tiver 100% da vida padrao + bonus, ganhara o dobro de dano em zumbis
                            delete jogo.balas[i];		//deletar balas pra nao matar multiplos zumbis enfileirados
                            if(jogo.inimigos[z].hp <= 0){	//checar hp do inimigo para ver se deve morrer
                                delete jogo.inimigos[z];		//deletar o que não tem hp
                                jogo.zumbisMortos++;			//contador de zumbis mortos
                                if(calcRound(jogo.roundAtual).nzt == jogo.zumbisMortos){ //numero de zumbis mortos deve ser igual ao numero de zumbis totais até aquele round, para poder avançar ao proximo round
                                    jogo.roundAtual++;
                                    jogo.jogador.hp += jogo.hpPorRound;	//jogador ganha um bonus de hp, por sobreviver aquele round
                                    jogo.inimigos = {};
                                }
                            }
                        }
                    }
                }
            });
        });

        $.each(jogo.inimigos,function(i){//movimento dos zumbis
            var img2 = new Image();
            img2.src = jogo.inimigos[i].direcao;
            ctx.drawImage(img2,jogo.inimigos[i].x,jogo.inimigos[i].y);//desenhar cada um no canvas

            if(distancia(jogo.jogador,jogo.inimigos[i]) < 10) //checar se a distancia entre o jogador e o zumbi é baixa, se sim, o jogador perderá vida
                jogo.jogador.hp -= (jogo.roundAtual>=20) ? (0.2) : (0.1); //a partir do round 20, a força do zumbi dobra

            if(jogo.roundAtual<20 && !jogo.gogogo){//se o round é menor que 20, o inimigo anda 1 dimensão por vez (x,y)
                if(jogo.inimigos[i].x < jogo.jogador.x && (jogo.inimigos[i].x !== jogo.jogador.x)){
                    jogo.inimigos[i].direcao = Math.round(jogo.contar/10)%2 ? ("documentos/imagens/i_leste1.png") : ("documentos/imagens/i_leste2.png");//a cada 2 contagens, a imagem troca para simular movimento
                    jogo.inimigos[i].x += (jogo.roundAtual>=10) ? 0.5 : 0.25;//a partir do round 10, a velocidade dos zumbis dobra
                }
                else if(jogo.inimigos[i].y < jogo.jogador.y  && (jogo.inimigos[i].y !== jogo.jogador.y)){
                    jogo.inimigos[i].direcao = Math.round(jogo.contar/10)%2 ? ("documentos/imagens/i_sul1.png") : ("documentos/imagens/i_sul2.png");
                    jogo.inimigos[i].y += (jogo.roundAtual>=10) ? 0.5 : 0.25;
                }
                else if(jogo.inimigos[i].x > jogo.jogador.x  && (jogo.inimigos[i].x !== jogo.jogador.x)){
                    jogo.inimigos[i].direcao = Math.round(jogo.contar/10)%2 ? ("documentos/imagens/i_oeste1.png") : ("documentos/imagens/i_oeste2.png");
                    jogo.inimigos[i].x -= (jogo.roundAtual>=10) ? 0.5 : 0.25;
                }
                else if(jogo.inimigos[i].y > jogo.jogador.y  && (jogo.inimigos[i].y !== jogo.jogador.y)){
                    jogo.inimigos[i].direcao = Math.round(jogo.contar/10)%2 ? ("documentos/imagens/i_norte1.png") : ("documentos/imagens/i_norte2.png");
                    jogo.inimigos[i].y -= (jogo.roundAtual>=10) ? 0.5 : 0.25;
                }
            }
            else if(jogo.roundAtual>=20 || jogo.gogogo){//se é maior que 20, o zumbi anda na diagonal
                if(jogo.inimigos[i].x < jogo.jogador.x && (jogo.inimigos[i].x !== jogo.jogador.x)){
                    jogo.inimigos[i].direcao = Math.round(jogo.contar/10)%2 ? ("documentos/imagens/i_leste1.png") : ("documentos/imagens/i_leste2.png");
                    jogo.inimigos[i].x += 1;
                }
                if(jogo.inimigos[i].y < jogo.jogador.y  && (jogo.inimigos[i].y !== jogo.jogador.y)){
                    jogo.inimigos[i].direcao = Math.round(jogo.contar/10)%2 ? ("documentos/imagens/i_sul1.png") : ("documentos/imagens/i_sul2.png");
                    jogo.inimigos[i].y += 1;
                }
                if(jogo.inimigos[i].x > jogo.jogador.x  && (jogo.inimigos[i].x !== jogo.jogador.x)){
                    jogo.inimigos[i].direcao = Math.round(jogo.contar/10)%2 ? ("documentos/imagens/i_oeste1.png") : ("documentos/imagens/i_oeste2.png");
                    jogo.inimigos[i].x -= 1;
                }
                if(jogo.inimigos[i].y > jogo.jogador.y  && (jogo.inimigos[i].y !== jogo.jogador.y)){
                    jogo.inimigos[i].direcao = Math.round(jogo.contar/10)%2 ? ("documentos/imagens/i_norte1.png") : ("documentos/imagens/i_norte2.png");
                    jogo.inimigos[i].y -= 1;
                }
            }
        });

        switch(true){//pintar o hp de cores diferentes, só para efeito visual
            case jogo.jogador.hp>60:					//hp maior que 60 é pintado de verde
                ctx.fillStyle = '#00FF06';
                break;
            case jogo.jogador.hp<60 && jogo.jogador.hp>25://hp entre 60 e 25 é pintado de amarelo
                ctx.fillStyle = '#FFFF00';
                break;
            case jogo.jogador.hp<25:					//hp menor que 25 é pintado de vermelho
                ctx.fillStyle = '#FF0000';
                break;
        }
        ctx.fillText("HP: "+Math.round(jogo.jogador.hp),5,20); //escrever o hp do jogador

        ctx.fillStyle = '#FF0000';
        ctx.font = '75px Times New Roman';
        ctx.fillText(jogo.roundAtual,5,h-10);	//escrever o round atual do jogador

        if(jogo.info && !jogo.pause){//informaçoes adicionais fora do pause
            ctx.font = '20px Times New Roman';
            ctx.fillStyle = 'red';
            ctx.fillText("Kills: "+jogo.zumbisMortos,5,50);
            ctx.fillText("Kills faltando: "+(calcRound(jogo.roundAtual).nzt-jogo.zumbisMortos),5,80);
        }
    }

    setInterval(desenhar, 10);	//colocar a função em intervalo infinitamente, para que de impressão de movimento
}
init();