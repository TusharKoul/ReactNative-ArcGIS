class AGSSpatialReference {
    constructor(properties) {
        if (!properties) properties = {};

        this.wkid = properties.wkid;
        this.WKText = properties.WKText;
        this.verticalWKID = properties.verticalWKID;
    }

    static webMercator() {
        return new AGSSpatialReference({
            wkid:3857
        });
    }

    static WGS84() {
        return new AGSSpatialReference({
            wkid:4326
        });
    }

    isEqualToSpatialReference(other) {
        return ((this.wkid === other.wkid) || (this.WKText === other.WKText));
    }

}

module.exports = AGSSpatialReference;
