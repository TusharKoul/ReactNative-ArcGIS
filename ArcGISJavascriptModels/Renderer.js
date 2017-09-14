class Renderer {
    constructor(properties) {
        if (!properties) properties = {};
        this.rotationType = properties.rotationType;
        this.rotationExpression = properties.rotationExpression;
    }
}

const SymbolRotationType = {
    Arithmetic : "arithmetic",
    Geographic : "geographic"
};

Renderer.RotationType = SymbolRotationType;

module.exports = Renderer;