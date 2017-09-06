import {processColor} from 'react-native';

class AGSSymbol {
    static getColorArray(color) {
        let argb = processColor(color);
        let a = ((argb >> 24) & 0xFF);
        let r = ((argb >> 16) & 0xFF);
        let g = ((argb >> 8) & 0xFF);
        let b = (argb & 0xFF);
        return [r,g,b,a];
    }
}

module.exports = AGSSymbol;