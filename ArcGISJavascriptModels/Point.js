import SpatialReference from './SpatialReference'

class Point {
    constructor(properties) {
        if (!properties) properties = {};
        this.x = properties.x;
        this.y = properties.y;
        this.m = properties.m;
        this.z = properties.z;
        this.spatialReference = properties.spatialReference;
    }

    static point({x,y,spatialReference} = {}) {
        return new Point({
            x:x,
            y:y,
            spatialReference:spatialReference,
        });
    }

    static pointWebMercator(x, y) {
        return new Point({
            x:x,
            y:y,
            spatialReference:SpatialReference.webMercator()
        });
    }

    static pointWGS84(latitude, longitude) {
        return new Point({
            x:longitude,
            y:latitude,
            spatialReference:SpatialReference.WGS84()
        });
    }
}

module.exports = Point;