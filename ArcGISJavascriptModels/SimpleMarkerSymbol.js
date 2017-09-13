import Symbol from './Symbol'

class SimpleMarkerSymbol extends Symbol{
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
        return new SimpleMarkerSymbol({
            style:style,
            color:this.getColorArray(color),
            size:size,
            type:"esriSMS"
        });
    }
}

const SimpleMarkerSymbolStyle = {
    Circle : "esriSMSCircle",
    Cross : "esriSMSCross",
    Diamond : "esriSMSDiamond",
    Square : "esriSMSSquare",
    Triangle : "esriSMSTriangle",
    X : "esriSMSX"
};

SimpleMarkerSymbol.Style = SimpleMarkerSymbolStyle;

module.exports = SimpleMarkerSymbol;
