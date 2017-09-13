import Symbol from './Symbol'

class SimpleLineSymbol extends Symbol{
    constructor(properties) {
        if (!properties) properties = {};
        super(properties);
        this.type = properties.type;
        this.color = properties.color;
        this.style = properties.style;
        this.width = properties.width;
    }

    static symbol(style, color, width) {
        return new SimpleLineSymbol({
            style:style,
            color:this.getColorArray(color),
            width:width,
            type:"esriSLS"
        });
    }
}

const SimpleLineSymbolStyle = {
    Dash : "esriSLSDash",
    DashDot : "esriSLSDashDotDot",
    Dot : "esriSLSDot",
    Null : "esriSLSNull",
    Solid : "esriSLSSolid"
};

SimpleLineSymbol.Style = SimpleLineSymbolStyle;

module.exports = SimpleLineSymbol ;