import Renderer from './Renderer';

class SimpleRenderer extends Renderer {
    constructor(properties) {
        if (!properties) properties = {};
        super(properties);
        this.type = "simple";
        this.symbol = properties.symbol;
        this.description = properties.description;
        this.label = properties.label;
    }

    static simpleRenderer(symbol) {
        return new SimpleRenderer({
            symbol:symbol
        });
    }
}

module.exports = SimpleRenderer;