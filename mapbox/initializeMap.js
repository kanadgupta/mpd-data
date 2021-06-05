export function initializeMap(mapboxgl, map) {
  map.on('click', 'clusters', function (e) {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['clusters'],
    });
    const clusterId = features[0].properties.cluster_id;
    map.getSource('useofforce').getClusterExpansionZoom(clusterId, function (err, zoom) {
      if (err) return;
      map.easeTo({
        center: features[0].geometry.coordinates,
        zoom,
      });
    });
  });

  map.on('click', 'unclustered-point', function (e) {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const { properties } = e.features[0];
    // Just log the entire point data to the popup...
    // Make this prettier eventually!
    const popupContent = Object.keys(properties)
      .map(prop => `<b>${prop}</b>: ${properties[prop]}`)
      .join('<br/>');
    new mapboxgl.Popup().setLngLat(coordinates).setHTML(popupContent).addTo(map);
  });
}
