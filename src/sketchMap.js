const cesiumContainer = document.getElementById('cesiumContainer');

// 初始化Cesium Viewer
Cesium.Ion.defaultAccessToken = '';

const viewer = new Cesium.Viewer('cesiumContainer');

viewer.scene.globe.enableLighting = true;
viewer.animation.container.style.visibility = 'hidden';

viewer.shadowMap.darkness = 0.3; 
viewer.shadowMap.softShadows = true;

//绘制marker集合
const billboardCollection = new Cesium.BillboardCollection({ scene: viewer.scene });    
viewer.scene.primitives.add(billboardCollection);

var osmBuildings = viewer.scene.primitives.add(Cesium.createOsmBuildings({      
    defaultColor: Cesium.Color.GRAY, // 自定义默认颜色
    style: new Cesium.Cesium3DTileStyle({
        color: {
            conditions: [
                // ["${feature['building']} === 'hospital'", "rgba(255,0,0,0.9)"],
                // ["${feature['building']} === 'school'", "rgba(0,255,0,0.9)"],
                // // ["${feature['building']} === 'restaurant'", "color('#00FF00')"],
                // ["${feature['building']} === 'residential'", "rgba(255,0,255,0.9)"],
                // ["${feature['building']} === 'industrial'", "rgba(255,255,0,0.9)"],
                // ["${feature['building']} === 'commercial'", "rgba(0,0,255,0.9)"],
                // ["${feature['building']} === 'religious'", "rgba(0,255,255,0.9)"],
                // ["${feature['building']} === 'agriculture'", "color('#00FF00')"],
                // ["${feature['building']} === 'sports'", "rgba(0,0,0,0.9)"],
                // ["${feature['building']} === 'storage'", "color('#00FF00')"],
                // ["${feature['building']} === 'power'", "color('#00FF00')"],
                [true, "color('rgba(255,255,255,1)')"]
            ]
        }
    })
}));

osmBuildings.show = false;

//general function
const rgbaToHexWithAlpha = (rgba) => {
    const matches = rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
    if (!matches) {
        throw new Error('Invalid RGBA color format');
    }
    const r = parseInt(matches[1]).toString(16).padStart(2, '0');
    const g = parseInt(matches[2]).toString(16).padStart(2, '0');
    const b = parseInt(matches[3]).toString(16).padStart(2, '0');
    const alpha = parseFloat(matches[4]);
    const a = Math.round(alpha * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}${a}`;
}

const hexToRgba = (hex, a) => {
    hex = hex.replace(/^#/, '');  
    if (hex.length === 3) {
      hex = hex.split('').map(function(x) { return x + x; }).join('');
    }  
    var r = parseInt(hex.slice(0, 2), 16);
    var g = parseInt(hex.slice(2, 4), 16);
    var b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`
  }

//Setting button
const settingButton = document.createElement('button');
const settingContainer = document.createElement('div');

settingButton.classList.add('sketchmap-button');
// settingButton.textContent = 'SET';

var settingButtonIcon = document.createElement('i');
settingButtonIcon.className = 'fas fa-cog'; 
settingButton.appendChild(settingButtonIcon);

settingButton.style.right = '8px';
cesiumContainer.appendChild(settingButton);

settingContainer.classList.add('sketchmap-select-menu');
settingContainer.style.height = '0px';
cesiumContainer.appendChild(settingContainer);

settingButton.addEventListener('click', () => {
    if(settingContainer.style.height == '0px') {
        settingContainer.style.height = '80px'; 
        settingButton.style.backgroundColor = 'black';
        settingButton.style.color = 'white';
        settingButton.style.fontWeight = 'bold';       
    } else {
        settingContainer.style.height = '0px';  
        settingButton.style.backgroundColor = 'white';
        settingButton.style.color = 'black';
        settingButton.style.fontWeight = 'normal';
    }
})

const settingShadows = document.createElement('div');
const settingShadowsCheckbox = document.createElement('input');
const settingShadowsText = document.createElement('p');
settingShadows.classList.add('sketchmap-setting');
settingShadows.style.marginTop = '15px';
settingShadowsCheckbox.type = 'checkbox';
settingShadowsText.textContent = 'model shadow';
settingShadowsText.style.color = 'gray';
settingShadows.appendChild(settingShadowsCheckbox);
settingShadows.appendChild(settingShadowsText);
settingContainer.appendChild(settingShadows);

settingShadowsCheckbox.addEventListener('click', () => {
    if(settingShadowsCheckbox.checked) {
        viewer.shadows = true;
        settingShadowsText.style.color = 'black';
    } else {
        viewer.shadows = false;
        settingShadowsText.style.color = 'gray';
    }
})

const settingLighting = document.createElement('div');
const settingLightingCheckbox = document.createElement('input');
const settingLightingText = document.createElement('p');
settingLighting.classList.add('sketchmap-setting');
settingLightingCheckbox.type = 'checkbox';
settingLightingText.textContent = 'viewer lighting';
settingLightingText.style.color = 'black';
settingLighting.appendChild(settingLightingCheckbox);
settingLighting.appendChild(settingLightingText);
settingContainer.appendChild(settingLighting);

settingLightingCheckbox.checked = true;
settingLightingCheckbox.addEventListener('click', () => {
    if(settingLightingCheckbox.checked) {
        viewer.scene.globe.enableLighting = true;
        settingLightingText.style.color = 'black';
    } else {
        viewer.scene.globe.enableLighting = false;
        settingLightingText.style.color = 'gray';
    }
})

//OSM button
const osmButton = document.createElement('button');
const osmSelectMenu = document.createElement('div');
const osmShowButton = document.createElement('button');
const osmStyleContainer1 = document.createElement('div');
const osmLayerField = document.createElement('fieldset');
const osmLayerLegend = document.createElement('legend');
const osmLayerCheckbox = document.createElement('input');
const osmLayerStyleContainers = [];
const layerNames = [
    'hospital',
    'school',
    'residential',
    'industrial',
    'commercial',
    'religious',
    'sports'
]
const layerColors = [
    "rgba(107, 33, 255, 1)",
    "rgba(102, 255, 107, 1)",
    "rgba(20, 122, 255, 1)",
    "rgba(35, 240, 255, 1)",
    "rgba(255, 137, 20, 1)",
    "rgba(0, 0, 0, 1)",
    "rgba(255, 0, 0, 1)",
    "rgba(255, 255, 255, 1)"
]

const setLayerColorsElements = [];
const setLayerAlphauValueElements = [];

var osmStyle = [
    [true, "color('rgba(255,255,255,1)')"]
];

cesiumContainer.appendChild(osmButton);
osmButton.classList.add('sketchmap-button');
osmButton.style.right = '85px';
osmButton.id = 'osm-button';
// osmButton.textContent = 'OSM'

var osmButtonIcon = document.createElement('i');
osmButtonIcon.className = 'fas fa-city'; 
osmButton.appendChild(osmButtonIcon);

cesiumContainer.appendChild(osmSelectMenu);
osmSelectMenu.classList.add('sketchmap-select-menu');

const settingVisiable = document.createElement('div');
const settingVisiableCheckbox = document.createElement('input');
const settingVisiableText = document.createElement('p');

settingVisiable.classList.add('sketchmap-setting');
settingVisiableCheckbox.type = 'checkbox';
settingVisiableText.textContent = 'show buildings';
settingVisiableText.style.color = 'gray';
settingVisiable.appendChild(settingVisiableCheckbox);
settingVisiable.appendChild(settingVisiableText);
osmSelectMenu.appendChild(settingVisiable);

osmStyleContainer1.classList.add('osm-style-container');
osmStyleContainer1.textContent = 'color: ';

osmSelectMenu.appendChild(osmStyleContainer1);

const setColorBar1 = document.createElement('input');
const alphaValue1 = document.createElement('input');
setColorBar1.value = '#FFFFFFFF';
setColorBar1.classList.add('osm-color');
new jscolor(setColorBar1, {
    alphaChannel: true,
    alphaElement: alphaValue1
});
osmStyleContainer1.appendChild(setColorBar1);

osmLayerField.classList.add('osm-layer-field');
osmLayerCheckbox.type = 'checkbox';
osmLayerLegend.textContent = 'layers';
osmLayerLegend.appendChild(osmLayerCheckbox);
osmLayerField.appendChild(osmLayerLegend);
osmSelectMenu.appendChild(osmLayerField);

for(i=0; i<7; i++) {
    let layerStyleContainer = document.createElement('div');
    layerStyleContainer.classList.add('osm-style-container');
    let setColorBar = document.createElement('input');
    let alphaValue = document.createElement('input');
    setColorBar.classList.add('osm-color');
    setColorBar.style.width = '70%';
    setColorBar.value = rgbaToHexWithAlpha(layerColors[i]);
    new jscolor(setColorBar, {
        alphaChannel: true,
        alphaElement: alphaValue
    });
    layerStyleContainer.appendChild(setColorBar);
    osmLayerStyleContainers.push(layerStyleContainer);

    setLayerColorsElements.push(setColorBar);
    setLayerAlphauValueElements.push(alphaValue);
}

osmLayerStyleContainers.forEach((item, index) => {
    let layerStyleText = document.createElement('p');
    layerStyleText.style.margin = `${index == 0?2:25}px 2px 2px 2px`;
    layerStyleText.textContent = layerNames[index];
    osmLayerField.append(layerStyleText);
    osmLayerField.append(item);
})

osmLayerCheckbox.addEventListener('click', () => {
    if(osmLayerCheckbox.checked) {
        osmLayerField.style.color = 'black';
        updateOsmLayersColor();        
    } else {
        osmLayerField.style.color = 'gray'
        updateOsmLayersColor();
    }
 })

function updateOsmLayersColor() {
    if(osmLayerCheckbox.checked) {
        osmStyle = [               
            ["${feature['building']} === 'hospital'", `${layerColors[0]}`],
            ["${feature['building']} === 'school'", `${layerColors[1]}`],
            ["${feature['building']} === 'residential'", `${layerColors[2]}`],
            ["${feature['building']} === 'industrial'", `${layerColors[3]}`],
            ["${feature['building']} === 'commercial'", `${layerColors[4]}`],
            ["${feature['building']} === 'religious'", `${layerColors[5]}`],
            ["${feature['building']} === 'sports'", `${layerColors[6]}`],
            [true, `color('${layerColors[7]}')`]
        ];
        let newStyle = new Cesium.Cesium3DTileStyle({
            color: {
                conditions: osmStyle
            }
        });
        osmBuildings.style = newStyle;
    } else {
        osmStyle = [
            [true, `color('${layerColors[layerColors.length - 1]}')`]
        ]
        let newStyle = new Cesium.Cesium3DTileStyle({
            color: {
                conditions: osmStyle
            }
        });
        osmBuildings.style = newStyle;
    }
}

osmButton.addEventListener('click', () => {
    if(osmSelectMenu.style.height === '0px') {
        osmButton.style.background = 'rgb(0,0,0)'
        osmButton.style.color = 'white'
        osmButton.style.fontWeight = 'bold'
        osmSelectMenu.style.height = '60%'
    } else {
        osmButton.style.background = 'rgb(255,255,255)'
        osmButton.style.color = 'black'
        osmButton.style.fontWeight = 'normal'
        osmSelectMenu.style.height = '0px'
    }
})

settingVisiableCheckbox.addEventListener('click', () => {
    if(settingVisiableCheckbox.checked) {
        osmBuildings.show = true
        settingVisiableText.style.color = 'black';
    } else {
        osmBuildings.show = false
        settingVisiableText.style.color = 'gray';
    }
})

setColorBar1.addEventListener('change', (event) => {
    let color = hexToRgba(event.target.value, alphaValue1.value);
    layerColors[layerColors.length - 1] = color;  
    updateOsmLayersColor();      
});

setLayerColorsElements.forEach((item, index) => {
    item.addEventListener('change', (event) => {
        if(osmLayerCheckbox.checked) {
            let color = hexToRgba(event.target.value, setLayerAlphauValueElements[index].value);
            layerColors[index] = color;
            updateOsmLayersColor(); 
        }
    });
})

//search function
var originalDestinationFound = viewer.geocoder.viewModel.destinationFound;
viewer.geocoder.viewModel.destinationFound = function(viewModel, destination) {
    
    if (originalDestinationFound) {
        originalDestinationFound(viewModel, destination);
    }

    console.log('目的地为：', destination);
    var name = viewer.geocoder.viewModel.searchText;
    var longitude = Cesium.Math.toDegrees((destination.west + destination.east)/2); 
    var latitude = Cesium.Math.toDegrees((destination.north + destination.south)/2); 
    var height = destination.height; // 高度，单位通常是米

    var location = {
        longitude: longitude,
        latitude: latitude,
        height: height
    }    

    baikeMarkerRender(location, name);
    locationInfoIframe.src = `https://baike.sogou.com/m/fullLemma?key=${name}`;
    locationInfoContainer.style.display = 'block';
    locationInfoContainer.style.width = '40%';
    locationInfoContainer.style.height = '80%';

};

//baike marker 
var baikeMarker;
function baikeMarkerRender(location, name) {
    billboardCollection.removeAll();

    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF00';
    ctx.fillRect(0, 0, canvas.width, 100);
    ctx.font = '20px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';

    const cityName = name;
    ctx.fillText(cityName, canvas.width/2, 70, 400);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 80);
    ctx.lineTo(canvas.width/2, 190);
    ctx.stroke();

    const base64Image = canvas.toDataURL('image/png');
    let image = new Image();
    image.src = base64Image;

    baikeMarker = billboardCollection.add({
            position : new Cesium.Cartesian3.fromDegrees(location.longitude,location.latitude, 100),
            image : image,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            heightReference:Cesium.HeightReference.CLAMP_TO_GROUND,
            scale: 1,
            id: 'searchedLocation'
        });

    locationButton.style.background = 'rgb(0,0,0,1)'
    locationButton.style.color = 'white'
    locationButton.style.fontWeight = 'bold'
}

const locationButton = document.createElement('button');
cesiumContainer.appendChild(locationButton);
locationButton.classList.add('sketchmap-button');
locationButton.id = 'location-button';
// locationButton.textContent = 'LOC';

var locationButtonIcon = document.createElement('i');
locationButtonIcon.className = 'fas fa-map-marker-alt'; 
locationButton.appendChild(locationButtonIcon);

locationButton.addEventListener('click', () => {
    baikeMarker.show = !baikeMarker.show
    if(locationInfoContainer.style.display === 'none') {
        locationInfoContainer.style.display = 'block'
    } else {
        locationInfoContainer.style.display = 'none'
    }

    if(baikeMarker.show) {
        locationButton.style.background = 'black'
        locationButton.style.color = 'white'
        locationButton.style.fontWeight = 'bold'
    } else {
        locationButton.style.background = 'white'
        locationButton.style.color = 'black'
        locationButton.style.fontWeight = 'normal'
    }
})

//location info
const locationInfoContainer = document.createElement('div');
const locationInfoIframe = document.createElement('iframe');
const locationInfoButton = document.createElement('button');
locationInfoContainer.classList.add('location-info');
locationInfoButton.classList.add('location-info-button');
locationInfoButton.textContent = '≡';

locationInfoContainer.appendChild(locationInfoButton);
locationInfoContainer.appendChild(locationInfoIframe);
cesiumContainer.appendChild(locationInfoContainer);

locationInfoIframe.src = ``;
locationInfoIframe.style.width = '100%';
locationInfoIframe.style.height = '112%';
locationInfoIframe.style.marginTop = '-50px';

locationInfoButton.addEventListener('click', () => {
    if(locationInfoContainer.style.height == '80%') {
        locationInfoContainer.style.width = '32px';
        locationInfoContainer.style.height = '32px';
    } else {
        locationInfoContainer.style.width = '40%';
        locationInfoContainer.style.height = '80%';
    }
})

//modeling
const modelingButton = document.createElement('button');
const modelingList = document.createElement('div');
const dotButton = document.createElement('button'); 
const polyLineButton = document.createElement('button'); 
const polygonButton = document.createElement('button'); 
const extrudeButton = document.createElement('button');
const eraseButton = document.createElement('button');

const extrudedHeightInput = document.createElement('input');
const extrudedHeightButton = document.createElement('button');
const extrudedHeightCancelButton = document.createElement('button');

modelingList.classList.add('sketchmap-select-menu');
modelingList.style.height = '0px';
modelingList.style.width = '32px';
modelingList.style.backgroundColor = '#FFFFFF00';
modelingList.style.opacity = '1';
cesiumContainer.appendChild(modelingList)

dotButton.classList.add('modeling-button');
polyLineButton.classList.add('modeling-button');
polygonButton.classList.add('modeling-button');
extrudeButton.classList.add('modeling-button');
eraseButton.classList.add('modeling-button');
modelingList.appendChild(dotButton);
modelingList.appendChild(polyLineButton);
modelingList.appendChild(polygonButton);
modelingList.appendChild(extrudeButton);
modelingList.appendChild(eraseButton);
dotButton.textContent = '点';
polyLineButton.textContent = '线';
polygonButton.textContent = '面';
extrudeButton.textContent = '挤出';
eraseButton.textContent = '删除';

modelingButton.classList.add('sketchmap-button');
modelingButton.id = 'modeling-button';
// modelingButton.textContent = 'MOD';

var modelingButtonIcon = document.createElement('i');
modelingButtonIcon.className = 'fas fa-pencil-ruler'; 
modelingButton.appendChild(modelingButtonIcon);

cesiumContainer.appendChild(modelingButton);

modelingButton.addEventListener('click', () => {
    if(modelingList.style.height === '0px') {
        modelingList.style.height = '160px';
        modelingButton.style.background = 'rgb(0,0,0,1)'
        modelingButton.style.color = 'white'
        modelingButton.style.fontWeight = 'bold'
    } else {
        modelingList.style.height = '0px';
        modelingButton.style.background = 'white'
        modelingButton.style.color = 'black'
        modelingButton.style.fontWeight = 'normal'
        switchModlingButton('none');
        isModelingPoint = false;
        isModelingLine = false;
        isModelingPolygon = false;
        isExtrudingShape = false;
        isErase = false;
        handler.destroy();
        document.body.style.cursor = 'default';
    }
})

viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
  );

function switchModlingButton(id) {
    if(id === 'none') {
        [dotButton, polyLineButton, polygonButton, extrudeButton, eraseButton].forEach((item,index) => {
            item.style.backgroundColor = 'white';
            item.style.color = 'black';
            item.style.fontWeight = 'normal';
        })
    } else {        
        [dotButton, polyLineButton, polygonButton, extrudeButton, eraseButton].forEach((item,index) => {
            if(index === id) {
                item.style.backgroundColor = 'black';
                item.style.color = 'white';
                item.style.fontWeight = 'bold';
            } else {
                item.style.backgroundColor = 'white';
                item.style.color = 'black';
                item.style.fontWeight = 'normal';
            }
        })
    }
}

// 绘制点
var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas); 
var isModelingPoint = false;
var pointArray = [];
function createPoint(worldPosition) {
    const point = viewer.entities.add({
        id: new Date().getTime(),
        position: worldPosition,
        point: {
            color: Cesium.Color.WHITE,
            pixelSize: 5,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
    });
    pointArray.push(point);
    return point;
}

function startDrawingPoint() {
    handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    handler.setInputAction(function (event) {
        const ray = viewer.camera.getPickRay(event.position);
        const earthPosition = viewer.scene.globe.pick(ray, viewer.scene);
        if (Cesium.defined(earthPosition)) {
            createPoint(earthPosition);
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

dotButton.addEventListener('click', () => {
    isModelingPoint = !isModelingPoint;
    handler.destroy();
    if(isModelingPoint) {
        startDrawingPoint();
        switchModlingButton(0);
        document.body.style.cursor = 'crosshair';
        isModelingLine = false;
        isModelingPolygon = false;
        isExtrudingShape = false;
        isErase = false;
    } else {
        dotButton.style.backgroundColor = 'white';
        dotButton.style.color = 'black';
        dotButton.style.fontWeight = 'normal';
        document.body.style.cursor = 'default';
    }
})

//绘制线面
var isModelingLine = false;
var polyLineArray = [];
var polygonArray = [];
function drawShape(positionData, drawingMode) {
  let shape;
  if (drawingMode === "line") {
    shape = viewer.entities.add({
        id: new Date().getTime() + 'l',
        polyline: {
            positions: positionData,
            clampToGround: true,
            width: 3,
        },
    });
    polyLineArray.push(shape);
  } else if (drawingMode === "polygon") {
    shape = viewer.entities.add({
        id: new Date().getTime() + 's',
        polygon: {
            hierarchy: positionData,
            material: new Cesium.ColorMaterialProperty(
            Cesium.Color.WHITE.withAlpha(0.7),
            ),
        },
    });
    polygonArray.push(shape);
  }
  return shape;
}

var activeShapePoints = [];
var activeShape;
var floatingPoint;
function startDrawingShape(drawingMode) {
    handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    handler.setInputAction(function (event) {
    const ray = viewer.camera.getPickRay(event.position);
    const earthPosition = viewer.scene.globe.pick(ray, viewer.scene);
    if (Cesium.defined(earthPosition)) {
        if (activeShapePoints.length === 0) {
            floatingPoint = createPoint(earthPosition);
            activeShapePoints.push(earthPosition);
            const dynamicPositions = new Cesium.CallbackProperty(function () {
                if (drawingMode === "polygon") {
                    return new Cesium.PolygonHierarchy(activeShapePoints);
                }
                    return activeShapePoints;
            }, false);
            activeShape = drawShape(dynamicPositions, drawingMode);
        }
        activeShapePoints.push(earthPosition);
        createPoint(earthPosition);
    }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    handler.setInputAction(function (event) {
    if (Cesium.defined(floatingPoint)) {
        const ray = viewer.camera.getPickRay(event.endPosition);
        const newPosition = viewer.scene.globe.pick(ray, viewer.scene);
        if (Cesium.defined(newPosition)) {
        floatingPoint.position.setValue(newPosition);
        activeShapePoints.pop();
        activeShapePoints.push(newPosition);
        }
    }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    function terminateShape() {
        activeShapePoints.pop();
        drawShape(activeShapePoints, drawingMode);
        viewer.entities.remove(floatingPoint);
        viewer.entities.remove(activeShape);
        floatingPoint = undefined;
        activeShape = undefined;
        activeShapePoints = [];
    }

    handler.setInputAction(function (event) {
        terminateShape();
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

}

polyLineButton.addEventListener('click', () => {
    isModelingLine = !isModelingLine;
    handler.destroy();
    if(isModelingLine) {
        startDrawingShape('line');
        switchModlingButton(1);
        document.body.style.cursor = 'crosshair';
        isModelingPoint = false;
        isModelingPolygon = false;
        isExtrudingShape = false;
        isErase = false;
    } else {
        polyLineButton.style.backgroundColor = 'white';
        polyLineButton.style.color = 'black';
        polyLineButton.style.fontWeight = 'normal';
        document.body.style.cursor = 'default';
    }
})

var isModelingPolygon = false;
polygonButton.addEventListener('click', () => {
    isModelingPolygon = !isModelingPolygon;
    handler.destroy();
    if(isModelingPolygon) {
        startDrawingShape('polygon');
        switchModlingButton(2);
        document.body.style.cursor = 'crosshair';
        isModelingPoint = false;
        isModelingLine = false;
        isExtrudingShape = false;
        isErase = false;
    } else {
        polygonButton.style.backgroundColor = 'white';
        polygonButton.style.color = 'black';
        polygonButton.style.fontWeight = 'normal';
        document.body.style.cursor = 'default';
    }
})

//挤出功能
const extrudedHeightSetting = document.createElement('div');
extrudedHeightSetting.classList.add('extrude-setting-container');
extrudedHeightButton.classList.add('extrude-setting-button');
extrudedHeightCancelButton.classList.add('extrude-setting-button');
extrudedHeightSetting.textContent = 'Height(m): '
extrudedHeightInput.type = 'text';
extrudedHeightInput.style.width = '70px';
extrudedHeightInput.style.margin = '0 2px';
extrudedHeightButton.textContent = 'OK';
extrudedHeightCancelButton.textContent = 'Cancel';
extrudedHeightSetting.appendChild(extrudedHeightInput);
extrudedHeightSetting.appendChild(extrudedHeightButton);
extrudedHeightSetting.appendChild(extrudedHeightCancelButton);
cesiumContainer.appendChild(extrudedHeightSetting);
extrudedHeightSetting.style.width = '0px';  

var isOnObject = false;
var isExtrudingShape = false;
var selectedObject;
var volumeArray = [];

extrudedHeightButton.addEventListener('click', () => {
    createVolume(selectedObject, extrudedHeightInput.value);  
    extrudedHeightSetting.style.width = '0px';  
})

extrudedHeightCancelButton.addEventListener('click', () => {
    extrudedHeightSetting.style.width = '0px';  
})

function mousemoveEventFunction(event) {
    var x = event.clientX;
    var y = event.clientY;
    extrudedHeightSetting.style.left = `${x}px`;
    extrudedHeightSetting.style.top = `${y}px`;
};

function startExtrudeShape() {
    handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    handler.setInputAction(function(movement) {
        try{
            var pickedObject = viewer.scene.pick(movement.endPosition);
            if (Cesium.defined(pickedObject) && pickedObject.id._id.includes('s')) {
                isOnObject = true;
                selectedObject = polygonArray.find(item => item.id === pickedObject.id._id)
                console.log(selectedObject)
                if(extrudedHeightSetting.style.width == '0px') {
                    document.addEventListener('mousemove', mousemoveEventFunction)
                }
                document.body.style.cursor = 'pointer'
            } else {
                isOnObject = false;
                document.body.style.cursor = 'crosshair'
            }
        } catch(e) {
            console.error(e);
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    handler.setInputAction(function(event) {
        if(isOnObject) {
            document.removeEventListener('mousemove', mousemoveEventFunction);
            extrudedHeightSetting.style.width = '270px';
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}

extrudeButton.addEventListener('click', () => {
    isExtrudingShape = !isExtrudingShape;
    handler.destroy();
    if(isExtrudingShape) {
        startExtrudeShape();
        switchModlingButton(3);
        document.body.style.cursor = 'crosshair';
        isModelingPoint = false;
        isModelingLine = false;
        isModelingPolygon = false;
        isErase = false;
    } else {
        extrudeButton.style.backgroundColor = 'white';
        extrudeButton.style.color = 'black';
        extrudeButton.style.fontWeight = 'normal';
        document.body.style.cursor = 'default';
    }
})

function createVolume(selectedObject, extrudedHeight) {
    var volume;
    var specularMaterial = new Cesium.Material({
        fabric : {
            type: 'Specular',
            uniforms: {
                specular: new Cesium.Color(0.5, 0.5, 0.5, 1.0), // 高光反射颜色和强度
                shininess: 10.0 // 光泽度
            }
        }
      });

    volume = viewer.entities.add({
        id: new Date().getTime() + 'v',
        polygon: {
            hierarchy: selectedObject.polygon.hierarchy,
            extrudedHeight: extrudedHeight, // 设置挤出高度，单位为米
            height: 0,
            material: specularMaterial,
            outline: true, // 启用轮廓（边框）
            outlineColor: Cesium.Color.BLACK, // 设置轮廓颜色
            outlineWidth: 3, // 设置轮廓宽度
            shadows: Cesium.ShadowMode.ENABLED    
        }           
    });

    volumeArray.push(volume);
}

//删除功能
var isErase = false;

function startDeleteObject() {
    var pickedObject;
    handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    handler.setInputAction(function(movement) {
        try{
           pickedObject = viewer.scene.pick(movement.endPosition);
            if (Cesium.defined(pickedObject)) {
                isOnObject = true;
                document.body.style.cursor = 'pointer'
            } else {
                isOnObject = false;
                document.body.style.cursor = 'crosshair'
            }
        } catch(e) {
            console.error(e);
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    handler.setInputAction(function(event) {
        if(isOnObject) {
            viewer.entities.removeById(pickedObject.id._id);
            removeArrElement(pointArray, pickedObject);
            removeArrElement(polyLineArray, pickedObject);
            removeArrElement(polygonArray, pickedObject);
            removeArrElement(volumeArray, pickedObject); 
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}

function removeArrElement(arr, pickedObject) {
    var element = arr.find(item => item.id === pickedObject.id._id);
    var index = arr.indexOf(element);
    if (index > -1) {
        arr.splice(index, 1);
    }
}

eraseButton.addEventListener('click', () => {
    isErase = !isErase;
    handler.destroy();
    if(isErase) {
        startDeleteObject();
        switchModlingButton(4);
        document.body.style.cursor = 'crosshair';
        isModelingPoint = false;
        isModelingLine = false;
        isModelingPolygon = false;
        isExtrudingShape = false;
    } else {
        eraseButton.style.backgroundColor = 'white';
        eraseButton.style.color = 'black';
        eraseButton.style.fontWeight = 'normal';
        document.body.style.cursor = 'default';
    }
})

//测量功能
const measure = new Cesium.Measure(viewer);
const measureButton = document.createElement('button');
const measureContainer = document.createElement('div');
const measureLine = document.createElement('button');
const measureArea = document.createElement('button');
const measureRemove = document.createElement('button');

measureButton.classList.add('sketchmap-button');
// measureButton.textContent = 'MEA';

var measureIcon = document.createElement('i');
measureIcon.className = 'fas fa-ruler-combined'; 
measureButton.appendChild(measureIcon);

measureButton.classList.add('.measure-icon');
measureButton.style.right = '162px';
cesiumContainer.appendChild(measureButton);

measureContainer.id = "measureContainer";
measureContainer.classList.add('sketchmap-select-menu');
measureContainer.style.width = '32px';
measureContainer.style.height = '0px';
measureContainer.style.backgroundColor = '#FFFFFF00';
measureContainer.style.opacity = 1;
cesiumContainer.appendChild(measureContainer);

measureLine.classList.add('modeling-button');
measureArea.classList.add('modeling-button');
measureRemove.classList.add('modeling-button');

measureLine.textContent = '长度';
measureArea.textContent = '面积';
measureRemove.textContent = '清除';
measureContainer.appendChild(measureLine);
measureContainer.appendChild(measureArea);
measureContainer.appendChild(measureRemove);

measureButton.addEventListener('click', () => {
    if(measureContainer.style.height === '0px') {
        measureContainer.style.height = '100px';
        measureButton.style.backgroundColor = 'black';
        measureButton.style.color = 'white';
        measureButton.style.fontWeight = 'bold';
    } else {
        measureContainer.style.height = '0px';
        measureButton.style.backgroundColor = 'white';
        measureButton.style.color = 'black';
        measureButton.style.fontWeight = 'normal';
    }
 })

measureLine.addEventListener('click', () => {
    measure.drawLineMeasureGraphics({ clampToGround: true, callback: () => { } });
})

measureArea.addEventListener('click', () => {
    measure.drawAreaMeasureGraphics({ clampToGround: true, callback: () => { } });
})

measureRemove.addEventListener('click', () => {
    measure._drawLayer.entities.removeAll();
})
