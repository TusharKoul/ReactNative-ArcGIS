import AGSSymbol from './AGSSymbol'

class AGSimpleMarkerSymbol extends AGSSymbol{
    constructor(properties) {
        if (!properties) properties = {};
        super(properties);
        this.type = properties.type;
        this.color = properties.color;
        this.style = properties.style;
        this.size = properties.size;
        this.outline = properties.outline;
    }

    static symbol(style, color, size) {
        return new AGSimpleMarkerSymbol({
            style:style,
            color:this.getColorArray(color),
            size:size,
            type:"esriSMS"
        });
    }
}

const AGSimpleMarkerSymbolStyle = {
    Circle : "esriSMSCircle",
    Cross : "esriSMSCross",
    Diamond : "esriSMSDiamond",
    Square : "esriSMSSquare",
    Triangle : "esriSMSTriangle",
    X : "esriSMSX"
};

AGSimpleMarkerSymbol.Style = AGSimpleMarkerSymbolStyle;

module.exports = AGSimpleMarkerSymbol;
