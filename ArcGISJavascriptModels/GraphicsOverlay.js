import {processColor} from 'react-native';
class GraphicsOverlay {
    constructor(properties) {
        if (!properties) properties = {};
        this.maxScale = properties.maxScale;
        this.minScale = properties.minScale;
        this.opacity = properties.opacity;
        this.renderer = properties.renderer;
        this.renderingMode = properties.renderingMode;
        this.selectionColor = processColor(properties.selectionColor);
        this.visible = properties.visible;
        this.labelsEnabled = properties.labelsEnabled;
    }
}

const GraphicsOverlayRenderingMode = {
    Dynamic : 0,
    Static : 1,
};

GraphicsOverlay.RenderingMode = GraphicsOverlayRenderingMode;

module.exports = GraphicsOverlay;