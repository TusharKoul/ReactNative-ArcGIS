class AGSPolyline {

    constructor(properties) {
        if (!properties) properties = {};
        this.paths = properties.paths;
        this.spatialReference = properties.spatialReference;
    }

    // Check structure of json object from here ->
    // https://resources.arcgis.com/en/help/rest/apiref/geometry.html
    addPoint(x,y) {
        if(this.paths == null) {
            this.paths = [];
        }
        let lastPath = this.paths[this.paths.length - 1];
        if(lastPath == null) {
            lastPath = [];
            this.paths.push(lastPath);
        }
        lastPath.push([x,y]);
    }

    addPathWithPoints(points:Array<number>) {
        this.paths.push([points]);
    }

    addPathWithPointsAtIndex(points, index) {
        this.paths.splice(index, 0, [points]);
    }
}


module.exports = AGSPolyline;