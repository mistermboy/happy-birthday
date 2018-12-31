var Muro = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
    ctor:function (gameLayer, posicion) {
        this.gameLayer = gameLayer;

        // Crear Sprite - Cuerpo y forma
        var sprite = new cc.PhysicsSprite("#box_red1.png");
        // Cuerpo estática, no le afectan las fuerzas

        body = new cp.StaticBody(12);
        body.setPos(posicion);
        sprite.setBody(body);

        var shape = new cp.BoxShape(body,
           sprite.width+10,
            sprite.height+10);

        shape.setElasticity(0);
        shape.setFriction(1);

        this.gameLayer.space.addStaticShape(shape);
        this.gameLayer.addChild(sprite,10);

    }, update:function (dt, jugadorX) {

    }
});

