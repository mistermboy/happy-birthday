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
    muros:[],
    cajas:[],
    finalCaja:null,
    formasEliminar:[],
    chocandoMuro:null,
    isFinal:false,
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



        this.scheduleUpdate();



        return true;
    },update:function (dt) {

        this.jugador.actualizar();

        
        this.isFinal = false;
        for(var i=0;i<this.cajas.length;i++){
            if((Math.abs(this.cajas[i].body.p.x - this.finalCaja.body.p.x) < 10)
                && (Math.abs(this.cajas[i].body.p.y - this.finalCaja.body.p.y) < 10))
                this.isFinal = true;
        }

        console.log(this.isFinal)

        if(this.isFinal)
            console.log("HAS GAANAAAAADOOOOOOOOOOOO")

        for(var i = 0; i < this.cajas.length; i++) {
            this.cajas[i].actualizar();
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
            var muro = new Muro(this,
                cc.p(murosArray[i]["x"]+50,murosArray[i]["y"]-50));
            this.muros.push(muro);
        }

        var grupoCajas = this.mapa.getObjectGroup("cajas");
        var cajasArray = grupoCajas.getObjects();
        for (var i = 0; i < cajasArray.length; i++) {
            var caja = new Caja(this,
                cc.p(cajasArray[i]["x"]+50,cajasArray[i]["y"]-50));
            this.cajas.push(caja);
        }

        var grupoPosFinal = this.mapa.getObjectGroup("final");
        var finalArray = grupoPosFinal.getObjects();

        for (var i = 0; i < finalArray.length; i++) {
            var fin = new Fin(this,
                cc.p(finalArray[i]["x"]+50, finalArray[i]["y"]-50));
            this.finalCaja = fin;
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
