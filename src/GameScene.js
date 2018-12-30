var tipoSuelo = 1;
var tipoJugador = 2;
var tipoMoneda = 3;


var controles = {};
var teclas = [];


var GameLayer = cc.Layer.extend({
    _emitter: null,
    tiempoEfecto:0,
    space:null,
    jugador: null,
    mapa: null,
    mapaAncho: null,
    monedas:[],
    enemigos:[],
    pinchos:[],
    formasEliminar:[],
    ctor:function () {
        this._super();
        var size = cc.winSize;


        cc.spriteFrameCache.addSpriteFrames(res.jugador_subiendo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.jugador_avanzando_plist);
        cc.spriteFrameCache.addSpriteFrames(res.jugador_impactado_plist);
        cc.spriteFrameCache.addSpriteFrames(res.animacion_cuervo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.animaciontigre_plist);
        cc.spriteFrameCache.addSpriteFrames(res.moneda_plist);


        // Inicializar Space
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, 0);
        // Depuración
        this.depuracion = new cc.PhysicsDebugNode(this.space);
        this.addChild(this.depuracion, 10);




        this.space.addCollisionHandler(tipoJugador, tipoMoneda,
            null, this.collisionJugadorConMoneda.bind(this), null, null);

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

             var posicionXJugador = this.jugador.body.p.x - 200;
             this.setPosition(cc.p( -posicionXJugador,null));


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

        var grupoMuros = this.mapa.getObjectGroup("bloques");
        var murosArray = grupoMuros.getObjects();
        for (var i = 0; i < murosArray.length; i++) {
            var moneda = new Muro(this,
                cc.p(murosArray[i]["x"],murosArray[i]["y"]));
            this.monedas.push(moneda);
        }

        console.log(this.monedas);

      },
    collisionJugadorConMoneda:function (arbiter, space) {


        console.log("colision");
        this.monedas[0].body.vx = 100;


    },
    procesarKeyPressed(keyCode) {
        console.log("procesarKeyPressed " + keyCode);
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
        console.log("procesarKeyReleased " + keyCode);
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
            this.jugador.body.vx = 200;
        }
        if (controles.moverX < 0) {
            this.jugador.body.vx = -200;
        }
        if (controles.moverX == 0) {
            this.jugador.body.vx = 0;
        }

        if (controles.moverY > 0) {
            this.jugador.body.vy = 200;
        }
        if (controles.moverY < 0) {
            this.jugador.body.vy = -200;
        }
        if (controles.moverY == 0) {
            this.jugador.body.vy = 0;
        }

    },

});

var idCapaJuego = 1;

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer, 0, idCapaJuego);

    }
});
