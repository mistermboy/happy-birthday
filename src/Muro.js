var Muro = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
    body:null,
    ctor:function (gameLayer, posicion) {
        this.gameLayer = gameLayer;

        // Crear Sprite - Cuerpo y forma
        var sprite = new cc.PhysicsSprite("#box_red1.png");
        // Cuerpo estática, no le afectan las fuerzas

        this.body = new cp.StaticBody(100);
        this.body.setPos(posicion);
        sprite.setBody(this.body);

        var shape = new cp.BoxShape(this.body,
           sprite.width,
            sprite.height);

        shape.setFriction(1);

        this.gameLayer.space.addStaticShape(shape);
        this.gameLayer.addChild(sprite,10);

    }, update:function (dt, jugadorX) {

    }
});

