/**
 * Checks if a point is inside a polygon
 * @param {Object} point : the point to check
 * @param {Object} polygon : the polygon to check
 * @returns {boolean} : true if the point is inside the polygon, false otherwise
 */
export function pointInPolygon(point, polygon) {
    let inside = false;
    const { x, y } = point;
    const points = polygon.points;

    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const xi = points[i].x, yi = points[i].y;
        const xj = points[j].x, yj = points[j].y;

        const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    // console.log("pointInPolygon: ", point, polygon, inside);
    return inside;
}