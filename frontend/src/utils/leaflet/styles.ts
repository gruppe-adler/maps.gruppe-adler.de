type Style = (ctx: CanvasRenderingContext2D, properties: any) => void


const contourStyle = (ctx: CanvasRenderingContext2D, properties: { elevation: number }) => {
    ctx.lineWidth = .5;
    
    const color = (properties.elevation > 0) ? '#decec1' : '#a5bad6';
    
    ctx.strokeStyle = (properties.elevation === 0) ? '#94a9c7' : color;
}


const styles: { [layerName: string]: Style } = {
    contours_5: contourStyle,
    contours_10: contourStyle,
    contours_50: contourStyle,
    contours_100: contourStyle,
    roads: (ctx, properties: { type: 'track'|'main road'|'road', width: number }) => {
        ctx.lineWidth = properties.width;
        
        switch (properties.type) {
            case 'track':
                ctx.strokeStyle = '#d0ba95';
                break;
            case 'road':
                ctx.strokeStyle = '#ffffff';
                break;
            default:
                ctx.strokeStyle = '#f79868';
                break;
        }
    }
}

export default styles;



    
// {
//     vectorTileLayerStyles: {
//         house: ({ color }: { color: string }, zoom: number) => {
//             const [r, g, b, a]: [number, number, number, number] = eval(color);

//             const fillColor = `rgba(${r}, ${g}, ${b}, ${255 / a})`;

//             return {
//                 weight: 0,
//                 fillOpacity: 1,
//                 fillColor,
//                 interactive: false
//             };
//         },
//         contours_5: contourStyle,
//         contours_10: contourStyle,
//         contours_50: contourStyle,
//         contours_100: contourStyle,
//         Hill: (properties: any, zoom: number) => {
//             const icon = new Icon({
//                 iconUrl: relativeUrl('icons/hill.png')
//             });

//             // console.log(properties, icon);
//             return { icon: new Icon.Default() }
//         },
//         roads: (properties: any, zoom: number) => {
//             return {
//                 weight: 1,
//                 fillOpacity: 1,
//                 color: 'red',
//                 interactive: false
//             };
//         }
//     },
//     bounds: new LatLngBounds([-90, -180], [90, 180]),
// }
// );