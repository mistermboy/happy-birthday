var layer = null;

var MenuLayer = cc.Layer.extend({
    check:true,
    ctor: function () {

        this._super();
        cc.director.resume();
        var size = cc.winSize;


        this.spriteFondo = cc.Sprite.create(res.menu);
        this.spriteFondo.setPosition(cc.p(size.width/2 , size.height/2));
        this.spriteFondo.setScale( 1 );
        this.addChild(this.spriteFondo);


        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.procesarKeyPressed.bind(this)
        }, this);




        this.scheduleUpdate();

        return true;

    },procesarKeyPressed: function (dt) {

        if(this.check){
            this.check = false;
            this.removeAllChildren();
            layer = new GameLayer();
            this.addChild(layer);
        }

    }


});

var MenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        layer = new MenuLayer();
        this.addChild(layer);


    }

});