export function addDataLayer(map, data) {
  if (!map.getSource('useofforce')) {
    map.addSource('useofforce', {
      type: 'geojson',
      data,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });
  } else {
    map.getSource('useofforce').setData(data);
  }

  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'useofforce',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': 'rgb(229, 36, 59)',
      'circle-radius': ['step', ['get', 'point_count'], 15, 25, 20, 50, 30, 200, 40],
      'circle-opacity': 0.75,
      'circle-stroke-width': 4,
      'circle-stroke-color': '#fff',
      'circle-stroke-opacity': 0.5,
    },
  });

  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'useofforce',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count}',
      'text-font': ['Open Sans Bold'],
      'text-size': 16,
    },
    paint: {
      'text-color': 'white',
    },
  });

  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'useofforce',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-radius': ['step', ['get', 'event_count'], 20, 100, 30, 750, 40],
      'circle-color': 'rgb(229, 36, 59)',
      'circle-opacity': 0.75,
      'circle-stroke-width': 4,
      'circle-stroke-color': '#fff',
      'circle-stroke-opacity': 0.5,
    },
  });
}
