function color_filter(color) {
    switch (color) {
        case "red":
            return "#ff0000";
        
        case "green": 
            return "#00ff00";

        case "blue": 
            return "#0000ff";

        default:
            return color;
    }
}

module.exports = color_filter;