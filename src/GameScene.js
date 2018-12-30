var tipoJugador = 1;
var tipoBloque = 2;

var GameLayer = cc.Layer.extend({
    _emitter: null,
    tiempoEfecto: 0,
    space: null,
    jugador: null,
    mapa: null,
    mapaAncho: null,
    ctor: function () {
        this._super();
        var size = cc.winSize;

        cc.spriteFrameCache.addSpriteFrames(res.animacioncocodrilo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.animacioncocodrilo_plist);


        // Inicializar Space
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, -350);
        // Depuración
        this.depuracion = new cc.PhysicsDebugNode(this.space);
        this.addChild(this.depuracion, 10);

/*
        this.space.addCollisionHandler(tipoJugador, tipoBloque,
            null, this.collisionJugadorConMoneda.bind(this), null, null);


*/

        this.jugador = new Jugador(this, cc.p(50, 150));
        this.cargarMapa();
        this.scheduleUpdate();


        // Declarar emisor de particulas (parado)
        this._emitter = new cc.ParticleGalaxy.create();
        this._emitter.setEmissionRate(0);
        //this._emitter.texture = cc.textureCache.addImage(res.fire_png);
        this._emitter.shapeType = cc.ParticleSystem.STAR_SHAPE;
        this.addChild(this._emitter, 10);


        return true;
    }, update: function (dt) {
        this.jugador.actualizar();

        this.space.step(dt);

        // Control de emisor de partículas
        if (this.tiempoEfecto > 0) {
            this.tiempoEfecto = this.tiempoEfecto - dt;
            this._emitter.x = this.jugador.body.p.x;
            this._emitter.y = this.jugador.body.p.y;

        }
        if (this.tiempoEfecto < 0) {
            this._emitter.setEmissionRate(0);
            this.tiempoEfecto = 0;
        }


        var posicionXJugador = this.jugador.body.p.x - 200;
        var posicionYJugador = this.jugador.body.p.y - 100;
        this.setPosition(cc.p(-posicionXJugador, -posicionYJugador));


    }, cargarMapa: function () {
        this.mapa = new cc.TMXTiledMap(res.mapa1_tmx);
        // Añadirlo a la Layer
        this.addChild(this.mapa);
        // Ancho del mapa
        this.mapaAncho = this.mapa.getContentSize().width;

        var grupoSuelos = this.mapa.getObjectGroup("Suelos");
        var suelosArray = grupoSuelos.getObjects();


        for (var i = 0; i < suelosArray.length; i++) {
            var suelo = suelosArray[i];
            var puntos = suelo.polylinePoints;
            for (var j = 0; j < puntos.length - 1; j++) {
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


        //Sustituir por bloques

        /*
        var grupoMonedas = this.mapa.getObjectGroup("Monedas");
        var monedasArray = grupoMonedas.getObjects();
        for (var i = 0; i < monedasArray.length; i++) {
            var moneda = new Moneda(this,
                cc.p(monedasArray[i]["x"],monedasArray[i]["y"]));
            this.monedas.push(moneda);
        }




    }, collisionJugadorConMoneda: function (arbiter, space) {

            this._emitter.setEmissionRate(5);
            this.tiempoEfecto = 3;

            this.jugador.body.applyImpulse(cp.v(300, 0), cp.v(0, 0));

            var shapes = arbiter.getShapes();

            this.formasEliminar.push(shapes[1]);
            var capaControles = this.getParent().getChildByTag(idCapaControles);
            capaControles.addMonedas();

        }

        */
}

});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});