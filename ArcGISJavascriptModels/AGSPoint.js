import AGSSpatialReference from './AGSSpatialReference'

class AGSPoint {
    constructor(properties) {
        if (!properties) properties = {};
        this.x = properties.x;
        this.y = properties.y;
        this.m = properties.m;
        this.z = properties.z;
        this.spatialReference = properties.spatialReference;
    }

    static point({x,y,spatialReference} = {}) {
        return new AGSPoint({
            x:x,
            y:y,
            spatialReference:spatialReference,
        });
    }

    static pointWebMercator(x, y) {
        return new AGSPoint({
            x:x,
            y:y,
            spatialReference:AGSSpatialReference.webMercator()
        });
    }

    static pointWGS84(latitude, longitude) {
        return new AGSPoint({
            x:longitude,
            y:latitude,
            spatialReference:AGSSpatialReference.WGS84()
        });
    }
}

module.exports = AGSPoint;