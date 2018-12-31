var Caja = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
    ctor:function (gameLayer, posicion) {
        this.gameLayer = gameLayer;

        this.gameLayer = gameLayer;

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#box_brown1.png");
        // Cuerpo estática, no le afectan las fuerzas

        this.body = new cp.Body(10, cp.momentForBox(1, this.sprite.width, this.sprite.height));
        this.body.setPos(posicion);
        this.sprite.setBody(this.body);

        this.gameLayer.space.addBody(this.body);

        var shape = new cp.BoxShape(this.body,
            this.sprite.width,
            this.sprite.height);


        shape.setCollisionType(tipoCaja);
        shape.setFriction(0.1);


        shape.setElasticity(1);

        this.gameLayer.space.addShape(shape);
        this.gameLayer.addChild(this.sprite, 10);
    },

    actualizar: function() {

        this.sprite.setRotation(0);
        this.sprite.setRotationX(0);
        this.sprite.setRotationY(0);
    }

});

