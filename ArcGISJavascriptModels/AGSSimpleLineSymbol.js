import AGSSymbol from './AGSSymbol'

class AGSSimpleLineSymbol extends AGSSymbol{
    constructor(properties) {
        if (!properties) properties = {};
        super(properties);
        this.type = properties.type;
        this.color = properties.color;
        this.style = properties.style;
        this.width = properties.width;
    }

    static symbol(style, color, width) {
        return new AGSSimpleLineSymbol({
            style:style,
            color:this.getColorArray(color),
            width:width,
            type:"esriSLS"
        });
    }
}

const AGSSimpleLineSymbolStyle = {
    Dash : "esriSLSDash",
    DashDot : "esriSLSDashDotDot",
    Dot : "esriSLSDot",
    Null : "esriSLSNull",
    Solid : "esriSLSSolid"
};

AGSSimpleLineSymbol.Style = AGSSimpleLineSymbolStyle;

module.exports = AGSSimpleLineSymbol ;