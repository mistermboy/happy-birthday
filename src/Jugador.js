
var estadoQuieto = 1;
var estadoCaminandoDerecha = 2;
var estadoCaminandoIzquierda = 3;
var estadoCaminandoArriba = 4;
var estadoCaminandoAbajo = 5;

var Jugador = cc.Class.extend({
    estado: estadoQuieto,
    animacion:null,
    aDerecha:null,
    aIzquierda:null,
    aArriba:null,
    aAbajo:null,
    aQuieto:null,
    gameLayer:null,
    sprite:null,
    shape:null,
    body:null,
ctor:function (gameLayer, posicion) {
    this.gameLayer = gameLayer;



    var framesAnimacion = [];
    for (var i = 1; i <= 4; i++) {
        var str = "jugador_idle" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    var actionAnimacionBucle =
        new cc.RepeatForever(new cc.Animate(animacion));
    this.aQuieto = actionAnimacionBucle;
    this.aQuieto.retain();


    var framesAnimacion = [];
    for (var i = 1; i <= 4; i++) {
        var str = "jugador_der" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    var actionAnimacionBucle =
        new cc.RepeatForever(new cc.Animate(animacion));
    this.aDerecha = actionAnimacionBucle;
    this.aDerecha.retain();

    var framesAnimacion = [];
    for (var i = 1; i <= 4; i++) {
        var str = "jugador_izq" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    var actionAnimacionBucle =
        new cc.RepeatForever(new cc.Animate(animacion));
    this.aIzquierda = actionAnimacionBucle;
    this.aIzquierda.retain();

    var framesAnimacion = [];
    for (var i = 1; i <= 4; i++) {
        var str = "jugador_arriba" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    var actionAnimacionBucle =
        new cc.RepeatForever(new cc.Animate(animacion));
    this.aArriba = actionAnimacionBucle;
    this.aArriba.retain();

    var framesAnimacion = [];
    for (var i = 1; i <= 4; i++) {
        var str = "jugador_bajar" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    var actionAnimacionBucle =
        new cc.RepeatForever(new cc.Animate(animacion));
    this.aAbajo = actionAnimacionBucle;
    this.aAbajo.retain();




    // Crear Sprite - Cuerpo y forma
    this.sprite = new cc.PhysicsSprite("#jugador_idle1.png");
    // Cuerpo dinámico, SI le afectan las fuerzas
    this.body = new cp.Body(1, cp.momentForBox(1,
        this.sprite.getContentSize().width,
        this.sprite.getContentSize().height));

    this.body.setPos(posicion);
    //body.w_limit = 0.02;
    this.body.setAngle(0);
    this.sprite.setBody(this.body);

    // Se añade el cuerpo al espacio
    gameLayer.space.addBody(this.body);


    // forma 16px más pequeña que la imagen original
    this.shape = new cp.BoxShape(this.body,
        this.sprite.getContentSize().width+16,
        this.sprite.getContentSize().height+16);
    this.shape.setCollisionType(tipoJugador);


    // forma dinamica
    gameLayer.space.addShape(this.shape);

    this.shape.setFriction(0.1);


    // ejecutar la animación
    this.sprite.runAction(actionAnimacionBucle);
    // añadir sprite a la capa
    gameLayer.addChild(this.sprite,10);


},
    actualizar: function (){

        this.body.rot = new cp.Vect(1,0);


        this.sprite.setRotationX(1);

        switch ( this.estado ){
            case estadoQuieto:
                if (this.animacion != this.aQuieto){
                    this.animacion = this.aQuieto;
                    this.sprite.stopAllActions();
                    this.sprite.runAction(this.animacion);
                }
                break;

            case estadoCaminandoDerecha:
                if (this.animacion != this.aDerecha){
                    this.animacion = this.aDerecha;
                    this.sprite.stopAllActions();
                    this.sprite.runAction(this.animacion);
                }
                break;

            case estadoCaminandoIzquierda:
                if (this.animacion != this.aIzquierda){
                    this.animacion = this.aIzquierda;
                    this.sprite.stopAllActions();
                    this.sprite.runAction(this.animacion);
                }
                break;


            case estadoCaminandoArriba:
                if (this.animacion != this.aArriba){
                    this.animacion = this.aArriba;
                    this.sprite.stopAllActions();
                    this.sprite.runAction(this.animacion);
                }
                break;

            case estadoCaminandoAbajo:
                if (this.animacion != this.aAbajo){
                    this.animacion = this.aAbajo;
                    this.sprite.stopAllActions();
                    this.sprite.runAction(this.animacion);
                }
                break;

        }
        this.sprite.setRotation(0);
        this.sprite.setRotationX(0);
        this.sprite.setRotationY(0);

}



});
