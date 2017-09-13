class SpatialReference {
    constructor(properties) {
        if (!properties) properties = {};

        this.wkid = properties.wkid;
        this.WKText = properties.WKText;
        this.verticalWKID = properties.verticalWKID;
    }

    static webMercator() {
        return new SpatialReference({
            wkid:3857
        });
    }

    static WGS84() {
        return new SpatialReference({
            wkid:4326
        });
    }

    isEqualToSpatialReference(other) {
        return ((this.wkid === other.wkid) || (this.WKText === other.WKText));
    }

}

module.exports = SpatialReference;
