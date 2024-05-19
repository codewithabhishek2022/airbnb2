
	mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: coordinates, // starting position [lng, lat]
        zoom: 12 // starting zoom
    });

console.log(coordinates);
    const marker1 = new mapboxgl.Marker({color:"red"})
        .setLngLat(coordinates)  //liting.geometry.coordinates
        .setPopup(new mapboxgl.Popup({offset:25}).setHTML("<h5>Welcome to WanderLust</h5>"))
        .addTo(map);
