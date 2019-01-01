var tipoSuelo = 1;
var tipoJugador = 2;
var tipoCaja = 3;
var tipoFinal = 4;



var controles = {};
var teclas = [];


var GameLayer = cc.Layer.extend({
    _emitter: null,
    tiempoEfecto:0,
    space:null,
    jugador: null,
    mapa: null,
    mapaAncho: null,
    barreras:[],
    marrones:[],
    azules:[],
    verdes:[],
    finalMarron:null,
    finalAzul:null,
    finalVerde:null,
    isFinalMarron:false,
    isFinalAzul:false,
    isFinalVerde:false,
    ctor:function () {
        this._super();
        var size = cc.winSize;


        cc.spriteFrameCache.addSpriteFrames(res.jugador_abajo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.jugador_arriba_plist);
        cc.spriteFrameCache.addSpriteFrames(res.jugador_der_plist);
        cc.spriteFrameCache.addSpriteFrames(res.jugador_izq_plist);
        cc.spriteFrameCache.addSpriteFrames(res.jugador_idle_plist);


        cc.spriteFrameCache.addSpriteFrames(res.animacion_cuervo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.animaciontigre_plist);
        cc.spriteFrameCache.addSpriteFrames(res.box_red_plist);
        cc.spriteFrameCache.addSpriteFrames(res.box_brown_plist);
        cc.spriteFrameCache.addSpriteFrames(res.box_final_brown_plist);
        cc.spriteFrameCache.addSpriteFrames(res.box_green_plist);
        cc.spriteFrameCache.addSpriteFrames(res.box_final_green_plist);
        cc.spriteFrameCache.addSpriteFrames(res.box_blue_plist);
        cc.spriteFrameCache.addSpriteFrames(res.box_final_blue_plist);
        cc.spriteFrameCache.addSpriteFrames(res.box_hole_plist);


        // Inicializar Space
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, 0);

        this.space.damping = 0.0001;




        // Depuración
       // this.depuracion = new cc.PhysicsDebugNode(this.space);
      //  this.addChild(this.depuracion, 10);



        /*

        this.space.addCollisionHandler(tipoJugador, tipoCaja,
            null, this.collisionJugadorConCaja.bind(this), null, null);


 */

        this.space.addCollisionHandler(tipoCaja, tipoFinal,
            null, this.colisionCajaFinal.bind(this), null, null, null);



        this.space.addCollisionHandler(tipoJugador, tipoFinal,
            null, this.colisionJugadorFinal.bind(this), null, null, null);


        this.jugador = new Jugador(this, cc.p(50,250));
        this.cargarMapa();


        // Declarar emisor de particulas (parado)
        this._emitter =  new cc.ParticleGalaxy.create();
        this._emitter.setEmissionRate(0);
        //this._emitter.texture = cc.textureCache.addImage(res.fire_png);
        this._emitter.shapeType = cc.ParticleSystem.STAR_SHAPE;
        this.addChild(this._emitter,10);


        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.procesarKeyPressed.bind(this),
            onKeyReleased: this.procesarKeyReleased.bind(this)
        }, this);


        var posicionXJugador = this.jugador.body.p.x - 200;
        this.setPosition(cc.p( -posicionXJugador,20));

        this.scheduleUpdate();



        return true;
    },update:function (dt) {

        this.jugador.actualizar();


        this.isFinalMarron = false;
        for(var i=0;i<this.marrones.length;i++){
            if((Math.abs(this.marrones[i].body.p.x - this.finalMarron.body.p.x) < 10)
                && (Math.abs(this.marrones[i].body.p.y - this.finalMarron.body.p.y) < 10))
                this.isFinalMarron = true;
        }

        this.isFinalAzul = false;
        for(var i=0;i<this.azules.length;i++){
            if((Math.abs(this.azules[i].body.p.x - this.finalAzul.body.p.x) < 10)
                && (Math.abs(this.azules[i].body.p.y - this.finalAzul.body.p.y) < 10))
                this.isFinalAzul = true;
        }


        this.isFinalVerde = false;
        for(var i=0;i<this.verdes.length;i++){
            if((Math.abs(this.verdes[i].body.p.x - this.finalVerde.body.p.x) < 10)
                && (Math.abs(this.verdes[i].body.p.y - this.finalVerde.body.p.y) < 10))
                this.isFinalVerde = true;
        }



        if(this.isFinalMarron && this.isFinalAzul && this.isFinalVerde)
            console.log("HAS GAANAAAAADOOOOOOOOOOOO")

        for(var i = 0; i < this.marrones.length; i++) {
            this.marrones[i].actualizar();
        }

        for(var i = 0; i < this.azules.length; i++) {
            this.azules[i].actualizar();
        }

        for(var i = 0; i < this.verdes.length; i++) {
            this.verdes[i].actualizar();
        }


        this.space.step(dt);

        this.procesarControles();


        // Control de emisor de partículas
        if (this.tiempoEfecto > 0){
             this.tiempoEfecto = this.tiempoEfecto - dt;
             this._emitter.x =  this.jugador.body.p.x;
             this._emitter.y =  this.jugador.body.p.y;

        }
        if (this.tiempoEfecto < 0) {
             this._emitter.setEmissionRate(0);
             this.tiempoEfecto = 0;
        }


    },cargarMapa:function () {
         this.mapa = new cc.TMXTiledMap(res.mapa1_tmx);
         // Añadirlo a la Layer
         this.addChild(this.mapa);
         // Ancho del mapa
         this.mapaAncho = this.mapa.getContentSize().width;

         var grupoSuelos = this.mapa.getObjectGroup("suelos");
         var suelosArray = grupoSuelos.getObjects();


         for (var i = 0; i < suelosArray.length; i++) {
             var suelo = suelosArray[i];
             var puntos = suelo.polylinePoints;
             for(var j = 0; j < puntos.length - 1; j++){
                 var bodySuelo = new cp.StaticBody();

                 var shapeSuelo = new cp.SegmentShape(bodySuelo,
                     cp.v(parseInt(suelo.x) + parseInt(puntos[j].x),
                         parseInt(suelo.y) - parseInt(puntos[j].y)),
                     cp.v(parseInt(suelo.x) + parseInt(puntos[j + 1].x),
                         parseInt(suelo.y) - parseInt(puntos[j + 1].y)),
                     10);
                 shapeSuelo.setCollisionType(tipoSuelo);
                 this.space.addStaticShape(shapeSuelo);
             }
         }


        var grupoMuros = this.mapa.getObjectGroup("muros");
        var murosArray = grupoMuros.getObjects();
        for (var i = 0; i < murosArray.length; i++) {
            var muro = new Barrera(this,
                cc.p(murosArray[i]["x"]+50,murosArray[i]["y"]-50),"#box_red1.png");
            this.barreras.push(muro);
        }

        /*
        var grupoHoles = this.mapa.getObjectGroup("holes");
        var holesArray = grupoHoles.getObjects();
        for (var i = 0; i < holesArray.length; i++) {
            var muro = new Barrera(this,
                cc.p(holesArray[i]["x"]+50,holesArray[i]["y"]-50),"#box-hole1.png");
            this.barreras.push(muro);
        }

*/

        var grupoMarrones = this.mapa.getObjectGroup("marrones");
        var marronesArray = grupoMarrones.getObjects();
        for (var i = 0; i < marronesArray.length; i++) {
            var caja = new Caja(this,
                cc.p(marronesArray[i]["x"]+50,marronesArray[i]["y"]-50),"brown");
            this.marrones.push(caja);
        }


        var grupoAzules = this.mapa.getObjectGroup("azules");
        var azulesArray = grupoAzules.getObjects();
        for (var i = 0; i < azulesArray.length; i++) {
            var caja = new Caja(this,
                cc.p(azulesArray[i]["x"]+50,azulesArray[i]["y"]-50),"blue");
            this.azules.push(caja);
        }


          var grupoVerdes = this.mapa.getObjectGroup("verdes");
          var verdesArray = grupoVerdes.getObjects();
          for (var i = 0; i < verdesArray.length; i++) {
              var caja = new Caja(this,
                  cc.p(verdesArray[i]["x"]+50,verdesArray[i]["y"]-50),"green");
              this.verdes.push(caja);
          }




        var grupoPosFinalMarron = this.mapa.getObjectGroup("fmarron");
        var finalArrayMarron = grupoPosFinalMarron.getObjects();

        for (var i = 0; i < finalArrayMarron.length; i++) {
            var fin = new Fin(this,
                cc.p(finalArrayMarron[i]["x"]+50, finalArrayMarron[i]["y"]-50),"brown");
            this.finalMarron = fin;
        }


        var grupoPosFinalAzul = this.mapa.getObjectGroup("fazul");
        var finalArrayAzul = grupoPosFinalAzul.getObjects();

        for (var i = 0; i < finalArrayAzul.length; i++) {
            var fin = new Fin(this,
                cc.p(finalArrayAzul[i]["x"]+50, finalArrayAzul[i]["y"]-50),"blue");
            this.finalAzul = fin;
        }


        var grupoPosFinalVerde = this.mapa.getObjectGroup("fverde");
        var finalArrayVerde = grupoPosFinalVerde.getObjects();

        for (var i = 0; i < finalArrayVerde.length; i++) {
            var fin = new Fin(this,
                cc.p(finalArrayVerde[i]["x"]+50, finalArrayVerde[i]["y"]-50),"green");
            this.finalVerde = fin;
        }


    },

    colisionCajaFinal:function(){

    },

    colisionJugadorFinal:function() {

    },

    procesarKeyPressed(keyCode) {
        var posicion = teclas.indexOf(keyCode);
        if (posicion == -1) {
            teclas.push(keyCode);
            switch (keyCode) {
                case 39:
                    // ir derecha
                    controles.moverX = 1;
                    break;
                case 37:
                    // ir izquierda
                    controles.moverX = -1;
                    break;

                case 38:
                    // ir arriba
                    controles.moverY = 1;
                    break;
                case 40:
                    // ir abajo
                    controles.moverY = -1;
                    break;
            }
        }
    },

    procesarKeyReleased(keyCode) {
        var posicion = teclas.indexOf(keyCode);
        teclas.splice(posicion, 1);
        switch (keyCode) {
            case 39:
                if (controles.moverX == 1) {
                    controles.moverX = 0;
                }
                break;
            case 37:
                if (controles.moverX == -1) {
                    controles.moverX = 0;
                }
                break;

            case 38:
                if (controles.moverY == 1) {
                    controles.moverY = 0;
                }
                break;
            case 40:
                if (controles.moverY == -1) {
                    controles.moverY = 0;
                }
                break;
        }
    },


    procesarControles() {


            if (controles.moverX > 0) {
                this.jugador.estado = estadoCaminandoDerecha;
                this.jugador.body.vx = 170;
            }
            if (controles.moverX < 0) {
                this.jugador.estado = estadoCaminandoIzquierda;
                this.jugador.body.vx = -170;
            }

            if (controles.moverX == 0) {
                this.jugador.estado = estadoQuieto;
                this.jugador.body.vx = 0;
            }

            if (controles.moverY > 0) {
                this.jugador.body.vy = 170;
                this.jugador.estado = estadoCaminandoArriba;
            }
            if (controles.moverY < 0) {
                this.jugador.body.vy = -170;
                this.jugador.estado = estadoCaminandoAbajo;
            }

            if (controles.moverY == 0) {
              //  this.jugador.estado = estadoQuieto;
                this.jugador.body.vy = 0;
            }


    }

});

var idCapaJuego = 1;

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer, 0, idCapaJuego);

    }
});
