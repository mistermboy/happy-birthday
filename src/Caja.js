var Caja = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
    ctor:function (gameLayer, posicion) {
        this.gameLayer = gameLayer;

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#box_brown1.png");
        // Cuerpo estática, no le afectan las fuerzas
        this.body = new cp.Body(5, cp.momentForBox(1,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height));
        this.body.setPos(posicion);
        this.body.setAngle(0);
        this.sprite.setBody(this.body);


        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width-25,
            this.sprite.getContentSize().height-25);
        this.shape.setCollisionType(tipoCaja);

        this.shape.setFriction(1);
        // forma estática
        gameLayer.space.addBody(this.body);

        // añadir sprite a la capa
        gameLayer.addChild(this.sprite,10);

        gameLayer.space.addShape(this.shape);
    }

});

