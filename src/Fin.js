var Fin = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
    ctor:function (gameLayer, posicion) {
        this.gameLayer = gameLayer;

        this.gameLayer = gameLayer;

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#box_final_brown1.png");
        // Cuerpo estática, no le afectan las fuerzas

        this.body = new cp.StaticBody(100);
        this.body.setPos(posicion);
        this.sprite.setBody(this.body);

        var shape = new cp.BoxShape(this.body,
            this.sprite.width - 16,
            this.sprite.height - 16);


        shape.setCollisionType(tipoFinal);
        shape.setFriction(1);

        this.gameLayer.space.addStaticShape(shape);
        this.gameLayer.addChild(this.sprite, 1);
    },

    actualizar: function() {

        this.sprite.setRotation(0);
        this.sprite.setRotationX(0);
        this.sprite.setRotationY(0);

    }

});

