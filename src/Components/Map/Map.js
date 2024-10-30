import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Viewer,
  createWorldTerrain,
  Cartesian3,
  ArcGisMapServerImageryProvider,
  SceneMode,
  SkyAtmosphere,
  GeoJsonDataSource,
  Color,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  BoundingSphere,
} from "cesium";
import Popup from "../Popup/Popup";
import * as Cesium from "cesium";
import useFetchTemperature from "./useFetchTemperature";
const imageryBasemap = new ArcGisMapServerImageryProvider({
  url: "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer",
  enablePickFeatures: false,
});
const geojsonUrl =
  "https://raw.githubusercontent.com/zeeshan1509/geojson-state/refs/heads/main/india_state.json";
const Map = () => {
  const [popupPosition, setPopupPosition] = useState(null);
  const { temperature, fetchTemperature } = useFetchTemperature();

  let highlightedEntity = null;

  const loadGeoJson = async (viewer) => {
    try {
      const geoJsonDataSource = await GeoJsonDataSource.load(geojsonUrl, {
        stroke: Color.BLACK,
        fill: Color.GRAY.withAlpha(0.5),
        strokeWidth: 3,
      });
      viewer.dataSources.add(geoJsonDataSource);
    } catch (error) {
      console.error("Failed to fetch GeoJSON data:", error);
    }
  };
  const resetHighlightedEntity = () => {
    if (highlightedEntity) {
      highlightedEntity.polygon.outlineColor = Color.BLACK;
      highlightedEntity.polygon.outlineWidth = 1.5;
      highlightedEntity = null;
    }
  };
  const loadEventHandler = (viewer) => {
    try {
      const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction((movement) => {
        const pickedObject = viewer.scene.pick(movement.endPosition);

        if (
          Cesium.defined(pickedObject) &&
          pickedObject.id &&
          pickedObject.id.polygon
        ) {
          const entity = pickedObject.id;

          if (highlightedEntity !== entity) {
            resetHighlightedEntity();
            entity.polygon.outlineColor = Color.BLUE;
            entity.polygon.outlineWidth = 3;
            highlightedEntity = entity;
            const boundingSphere = BoundingSphere.fromPoints(
              entity.polygon.hierarchy.getValue().positions
            );
            const center = boundingSphere.center;
            const cartographic = Cesium.Cartographic.fromCartesian(center);
            const lat = Cesium.Math.toDegrees(cartographic.latitude);
            const lon = Cesium.Math.toDegrees(cartographic.longitude);
            fetchTemperature(lat, lon);
            const screenPosition =
              viewer.scene.cartesianToCanvasCoordinates(center);
            setPopupPosition(screenPosition);
          }
        } else if (highlightedEntity) {
          resetHighlightedEntity();
          setPopupPosition(null);
        }
      }, ScreenSpaceEventType.MOUSE_MOVE);

      viewer.scene.postRender.addEventListener(() => {
        if (highlightedEntity && highlightedEntity.polygon.hierarchy) {
          const boundingSphere = BoundingSphere.fromPoints(
            highlightedEntity.polygon.hierarchy.getValue().positions
          );
          const center = boundingSphere.center;
          const screenPosition =
            viewer.scene.cartesianToCanvasCoordinates(center);
          setPopupPosition(screenPosition);
        }
      });

      return () => handler.destroy();
    } catch (error) {
      console.error("Error in loadEventHandler:", error);
    }
  };
  useEffect(() => {
    const viewer = new Viewer("cesiumContainer", {
      imageryProvider: imageryBasemap,
      terrainProvider: createWorldTerrain(),
      animation: false,
      geocoder: false,
      baseLayerPicker: false,
      timeline: false,
      homeButton: false,
      scene3DOnly: true,
      sceneMode: SceneMode.SCENE3D,
      navigationHelpButton: false,
      skyAtmosphere: new SkyAtmosphere(),
      infoBox: false,
      selectionIndicator: false,
    });
    const longitude = 77.2088;
    const latitude = 28.6139;
    const height = 5000000;
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(longitude, latitude, height),
      duration: 0,
    });
    loadGeoJson(viewer);
    loadEventHandler(viewer);

    return () => {
      viewer.destroy();
    };
  }, []);

  return (
    <div className="map">
      <div
        id="cesiumContainer"
        style={{ height: "100vh", width: "100%" }}
      ></div>
      {popupPosition && temperature && (
        <Popup position={popupPosition} temperature={temperature} />
      )}
    </div>
  );
};

export default Map;
