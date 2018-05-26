;!function(){
    "use strict";
    var canvas = $("#canvas"),
        ctx = canvas[0].getContext("2d"),
        width = canvas[0].width,
        height = canvas[0].height,
        jogo = {
            balas:{},
            inimigos:{},
            reload:false,
            save:false,
            reset:false,
            sair:false,
            info:false,
            pause:false,
            gogogo:false,
            balas_index:0,
            zumbis_index:0,
            contar:0,
            kills:0,
            round:1,
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
                x: Math.round(width/2-25),
                y: Math.round(height/2-50),
                imagem: "documentos/imagens/leste1.png",
                hp:100
            }
        },
        jogador = {
            vivo:() => jogo.jogador.hp>0 ? true : false,
            andar: function(){
                var self = jogo.jogador;
                self.imagem = self.imagem.replace("2","1");
                var velocidade = jogo.round>=20 && self.hp>=100+jogo.hpPorRound*jogo.round*0.8 ? 4 : 2;

                if(jogo.teclas[65] || jogo.teclas[37])//tecla A ou seta pra esquerda
                    for(var a = 0;a<velocidade;a++)
                        if(self.x>0)
                            movimento("oeste",self,1,3);

                if(jogo.teclas[68] || jogo.teclas[39])//tecla D ou seta pra direita
                    for(var e = 0;e<velocidade;e++)
                        if(self.x < width-50)
                            movimento("leste",self,1,1);

                if(jogo.teclas[87] || jogo.teclas[38])//tecla W ou seta pra cima
                    for(var i = 0;i<velocidade;i++)
                        if(self.y > 0)
                            movimento("norte",self,1,4);

                if(jogo.teclas[83] || jogo.teclas[40])//tecla S ou seta pra baixo
                    for(var o = 0;o<velocidade;o++)
                        if(self.y < height-85)
                            movimento("sul",self,1,2);
            }
        },
        sessao = sessionStorage.setItem('reset',JSON.stringify(jogo)),
        reset = JSON.parse(sessionStorage.getItem('reset')),
        aleat = (max,min) => Math.floor(Math.random() * (max - min + 1)) + min,
        distancia = (e1,e2) => Math.sqrt(Math.pow((e1.x - e2.x),2) + Math.pow((e1.y - e2.y),2));

    function foraDoCanvas(obj){
        if(obj.x <= 0 || obj.y <= 0 || obj.x >= width || obj.y >= height) return true;
    }

    function escrever(cor,tamanho,texto,x,y){
        ctx.fillStyle = cor;
        ctx.font = tamanho+" Times New Roman";
        ctx.fillText(texto,x,y);
    }

    function movimento(img,obj,velocidade,direcao){
        if(direcao === 1) obj.x += velocidade;
        if(direcao === 2) obj.y += velocidade;
        if(direcao === 3) obj.x -= velocidade;
        if(direcao === 4) obj.y -= velocidade;
        obj.imagem = obj.imagem.replace(/\w+\d/, Math.round(jogo.contar/10)%2 ? img+"1" : img+"2");
    }

    function atirar(img,obj,width,height,direcao){
        ctx.fillStyle = 'black';
        ctx.fillRect(obj.x, obj.y, width, height);
        movimento(img,obj,20,direcao);
    }

    function balas(id,x,y,imagem){//função para criar objetos dentro do objeto balas
        var obj = {id,x,y,imagem};
        jogo.balas[id] = obj;
        jogo.balas_index++;
    }

    function zumbis(id,x,y,imagem){//função para criar objetos dentro do objeto inimigos
        var obj = {
            id,x,y,
            imagem:'documentos/imagens/i_'+imagem,
            hp:calcRound(jogo.round).vida,
            nasceu:Date.now()
        };
        jogo.inimigos[id] = obj;
        jogo.zumbis_index++;
    }

    $(window).keydown(function(event){//escuta por algum evento de tecla
        jogo.teclas[event.keyCode] = true;
        if(event.keyCode == 32 && jogador.vivo()){//barra de espaço checar se o jogador esta vivo, e em que direçao esta, para desenharmos a bala de acordo
            if(jogo.jogador.imagem.indexOf("oeste") != -1)
                balas(jogo.balas_index,jogo.jogador.x-7,jogo.jogador.y+27,jogo.jogador.imagem);
            if(jogo.jogador.imagem.indexOf("leste") != -1)
                balas(jogo.balas_index,jogo.jogador.x+50,jogo.jogador.y+27,jogo.jogador.imagem);
            if(jogo.jogador.imagem.indexOf("norte") != -1)
                balas(jogo.balas_index,jogo.jogador.x+21.5,jogo.jogador.y-8,jogo.jogador.imagem);
            if(jogo.jogador.imagem.indexOf("sul") != -1)
                balas(jogo.balas_index,jogo.jogador.x+21,jogo.jogador.y+30,jogo.jogador.imagem);
        }
        if(event.keyCode == 80)//tecla P para pausar
            jogo.pause = !jogo.pause;
        if(event.keyCode == 89)//tecla y para mais info
            jogo.info = !jogo.info;
        if(event.keyCode == 27 && (!jogador.vivo() || jogo.pause))//na tela de game over, apertar Esc para sair
            jogo.sair = true;
        if(event.keyCode == 71)//apertar G reinicia o jogo
            jogo.reset = true;
        if(event.keyCode == 82 && event.originalEvent.repeat != undefined)
            jogo.gogogo = true;//apertar R acelera a velocidade dos zumbis
        if(event.keyCode == 82 && jogo.pause)
            jogo.reload = true;
        if(event.keyCode == 83 && jogo.pause)
            jogo.save = true;
    });

    $(window).keyup(function(event) {
        if(event.keyCode == 82)
            jogo.gogogo = false;
        jogo.teclas[event.keyCode] = false;
    });

    $(window).on("resize", function(){
        canvas[0].width = window.innerWidth - 4;	//existe uma diferença de 4px entre o tamanho da janela e o tamanho maximo do canvas
        canvas[0].height = window.innerHeight - 4;
        width = canvas[0].width;
        height = canvas[0].height;
    }).trigger("resize");

    function calcRound(round){		//calcular informaçoes sobre mudanças em cada round
        var zumbis = Math.round(6*Math.pow(1.15,round-1));
        var vida = Math.round(50*Math.pow(1.15,round-1));
        var zumbisTotais = 0;
        for(var i=0;i<round;i++)
            zumbisTotais += Math.round(6*Math.pow(1.15,i));
        return {zumbis, vida, zumbisTotais};
    }

    function posicaoAleat(){//calcular uma posição aleatorio de respawn do zumbi fora do canvas, para nao "brotarem"
        var x = aleat(-100,width+100), z = [-180,width+180], y;
        if((-50<x && x<0) || (width<x && x<width+50) || (0<x && x<width))
            y = z[aleat(-1,2)];
        if(x<0 || x>width)
            y = aleat(-180,height+180);
        return {x, y};
    }

    !function respawn(){
        var rate = Math.round(1000*Math.pow(0.98,jogo.round-1));
        rate = rate >= 500 ? rate : 500;
        var aleatorio = aleat(rate,rate*2);
        var pos = posicaoAleat();
        var intervalo = setTimeout(function(){
            if(calcRound(jogo.round).zumbisTotais > jogo.zumbis_index)
                if(document.hasFocus() && !jogo.pause && jogador.vivo())
                    if(jogo.zumbis_index - jogo.kills < 24)
                        zumbis(jogo.zumbis_index,pos.x,pos.y,'leste1.png');
            respawn();
        },aleatorio);
    }();

    function desenharFundo(){//desenhar o fundo de concreto em que o personagem anda
        var rua = new Image(100,100);
        rua.src = "documentos/imagens/concreto.jpg";
        var mapax = 0, mapay = 0;
        for(var i=0;i<width/100;i++){//iteraçoes para desenhar os blocos em cada parte do mapa de 100 em 100 x e y: (100,100) (100,200) (200,200) ...
            for(var j=0;j<height/100;j++){
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
                $("body").css({"background-color":"white","margin":"8px"}).children().show(800); //apagar o canvas e mostrar o html original
            }
        }

        if((jogo.pause || !document.hasFocus()) && jogador.vivo()){//janela sem foco ou botao de pausa pressionado, vai parar o jogo se o jogador estiver vivo
            var confirmar;
            escrever("white","20px","Jogo Pausado",width/2-50,height/2-20);
            escrever("white","20px",'Aperte Esc para sair',180,20);
            escrever("white","20px",'Aperte G para reiniciar',180,50);
            escrever("white","20px",'Aperte S para salvar',400,20);
            escrever("white","20px",'Aperte R para recarregar',400,50);
            if(jogo.reset){
                jogo.reset = false;
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
            escrever("red","50px",'Game Over',width/2-120,height/3);
            escrever("red","15px",'Você Sobreviveu '+jogo.round+' Rounds',width/2-85-5,height/3+20);
            escrever("red","15px",'Kills: '+jogo.kills,width/2-35,height/3+40);
            escrever("white","20px",'Aperte Esc para sair',180,20);
            escrever("white","20px",'Aperte G para reiniciar',180,50);
            if(!jogo.reset)
                return;	//se o jogador nao clicar pra jogar denovo, pare o jogo e escreva informaçoes, senao reinicia as variaveis e começamos denovo
            else
                jogo = reset;//JSON.parse(sessionStorage.getItem(jogo));
        } else
            jogador.andar();

        jogo.contar++; //contador de intervalos desenhar
        ctx.clearRect(0,0,width,height); //limpar canvas e desenhar objetos em outra posição dando impressao de movimento
        desenharFundo();
        var eu = jogo.jogador;
        var balas = jogo.balas;
        var zumbi = jogo.inimigos;
        var img = new Image();
        img.src = eu.imagem;
        ctx.drawImage(img,eu.x,eu.y); //criaçao do jogador

        $.each(balas,function(i){
            if(balas[i].x < width && balas[i].imagem.indexOf("leste") != -1)
                atirar("leste",balas[i], 7, 1, 1);				//velocidade de 20 a cada desenhar
            if(balas[i].y < height && balas[i].imagem.indexOf("sul") != -1)
                atirar("sul",balas[i], 1, 7, 2);
            if(balas[i].x > 0 && balas[i].imagem.indexOf("oeste") != -1)//checar se as balas estao dentro do canvas, e atirar de acordo com a posiçao do boneco
                atirar("oeste",balas[i], 7, 1, 3);						//criar balas com cada indice dentro do objeto
            if(balas[i].y > 0 && balas[i].imagem.indexOf("norte") != -1)
                atirar("norte",balas[i], 1, 7, 4);
            if(foraDoCanvas(balas[i]))
                delete balas[i];

            $.each(zumbi,function(z){//loop dentro de loop, para usar dois indices (i,z) para checar colisao de balas em zumbis
                if(balas[i] !== undefined)
                    if(balas[i].x > 0 && balas[i].x < width && balas[i].y > 0 && balas[i].y < height){//checar se balas estao dentro do canvas, pra nao danificar zumbis fora da tela
                        if(balas[i].x > zumbi[z].x+8 && balas[i].x < zumbi[z].x+40 && balas[i].y > zumbi[z].y && balas[i].y+2 < zumbi[z].y+83){//checando colisao entre os dois elementos
                            zumbi[z].hp -= jogo.round>=15 && eu.hp>=100+jogo.hpPorRound*14 ? 20 : 10;//se há colisao, zumbi perderá hp. No round 15, se o jogador tiver 100% da vida padrao + bonus, ganhara o dobro de dano em zumbis
                            delete balas[i];
                        }
                    }
                if(zumbi[z].hp <= 0){
                    jogo.kills++;
                    delete zumbi[z];
                }
            });
        });

        $.each(zumbi,function(i){
            var img2 = new Image();
            img2.src = zumbi[i].imagem;
            ctx.drawImage(img2,zumbi[i].x,zumbi[i].y);//desenhar cada um no canvas
            var poof = Math.round(45 * Math.pow(0.95, jogo.round - 1));
            poof = poof >= 10 ? poof : 10;
            var velocidade = jogo.round >= 10 ? 0.5 : 0.25;

            if(distancia(eu,zumbi[i]) < 10) //checar se a distancia entre o jogador e o zumbi é baixa, se sim, o jogador perderá vida
                eu.hp -= (jogo.round>=20) ? (0.2) : (0.1); //a partir do round 20, a força do zumbi dobra

            if((Date.now() - zumbi[i].nasceu) >= poof*1000){
                var pos = posicaoAleat();
                zumbi[i].x = pos.x;
                zumbi[i].y = pos.y;
                zumbi[i].nasceu = Date.now();
            }

            if(jogo.round<20 && !jogo.gogogo){//se o round é menor que 20, o inimigo anda 1 dimensão por vez (x,y)
                if(zumbi[i].x < eu.x && (zumbi[i].x !== eu.x))
                    movimento("i_leste",zumbi[i],velocidade,1);
                else if(zumbi[i].y < eu.y  && (zumbi[i].y !== eu.y))
                    movimento("i_sul",zumbi[i],velocidade,2);
                else if(zumbi[i].x > eu.x  && (zumbi[i].x !== eu.x))
                    movimento("i_oeste",zumbi[i],velocidade,3);
                else if(zumbi[i].y > eu.y  && (zumbi[i].y !== eu.y))
                    movimento("i_norte",zumbi[i],velocidade,4);
            }
            else if(jogo.round>=20 || jogo.gogogo){	//se é maior que 20, o zumbi anda na diagonal
                if(zumbi[i].x < eu.x && (zumbi[i].x !== eu.x))
                    movimento("i_leste",zumbi[i],1,1);
                if(zumbi[i].y < eu.y  && (zumbi[i].y !== eu.y))
                    movimento("i_sul",zumbi[i],1,2);
                if(zumbi[i].x > eu.x  && (zumbi[i].x !== eu.x))
                    movimento("i_oeste",zumbi[i],1,3);
                if(zumbi[i].y > eu.y  && (zumbi[i].y !== eu.y))
                    movimento("i_norte",zumbi[i],1,4);
            }
        });

        var cor = eu.hp>60 ? "#00FF06" : eu.hp<60 && eu.hp>25 ? "#FFFF00" :"#FF0000";
        escrever(cor,"20px","HP: "+Math.round(eu.hp),5,20);
        escrever("#FF0000","75px",jogo.round,5,height-10);

        if(jogo.info && !jogo.pause){	//informaçoes adicionais
            escrever("red","20px","Kills: "+jogo.kills,5,50);
            escrever("red","20px","Kills faltando: "+(calcRound(jogo.round).zumbisTotais-jogo.kills),5,80);
        }

        if(calcRound(jogo.round).zumbisTotais == jogo.kills){
            jogo.round++;
            eu.hp += jogo.hpPorRound;
            zumbi = {};
        }
    }

    setInterval(desenhar, 10);
}();