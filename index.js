
        var highlightLayer;
        function highlightFeature(e) {
            highlightLayer = e.target;

            if (e.target.feature.geometry.type === 'LineString') {
              highlightLayer.setStyle({
                color: '#ffff00',
              });
            } else {
              highlightLayer.setStyle({
                fillColor: '#ffff00',
                fillOpacity: 1
              });
            }
        }
        var map = L.map('map', {
            zoomControl:true, maxZoom:28, minZoom:10
        }).fitBounds([[-36.89958510224771,174.72018369682814],[-36.881467668888305,174.7494039753342]]);
        var hash = new L.Hash(map);
        map.attributionControl.setPrefix('<a href="https://github.com/tomchadwin/qgis2web" target="_blank">qgis2web</a> &middot; <a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> &middot; <a href="https://qgis.org">QGIS</a>');
        var autolinker = new Autolinker({truncate: {length: 30, location: 'smart'}});



        var bounds_group = new L.featureGroup([]);

        function setBounds() {
        }
        map.createPane('pane_OSMStandard_0');
        map.getPane('pane_OSMStandard_0').style.zIndex = 400;
        var layer_OSMStandard_0 = L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            pane: 'pane_OSMStandard_0',
            opacity: 1.0,
            attribution: '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors, CC-BY-SA</a>',
            minZoom: 1,
            maxZoom: 28,
            minNativeZoom: 0,
            maxNativeZoom: 19
        });
        layer_OSMStandard_0;
        map.addLayer(layer_OSMStandard_0);



        
        var savedSchools = [] ; // Array to store saved schools
        var notesData = {}; // JSON object to store notes

                //girls school popup
        function pop_school_girls_1(feature, layer) {

            layer.on({ 
                mouseout: function(e) {
                    for (i in e.target._eventParents) {
                        e.target._eventParents[i].resetStyle(e.target);
                    }
                },
                mouseover: highlightFeature,
            });

            var addr = (feature.properties['addr_house'] !== null ? autolinker.link(feature.properties['addr_house'].toLocaleString()) : '') + ' ' + (feature.properties['addr_stree'] !== null ? autolinker.link(feature.properties['addr_stree'].toLocaleString()) : '') + ', Auckland ' + (feature.properties['addr_postc'] !== null ? autolinker.link(feature.properties['addr_postc'].toLocaleString()) : '')
            var popupContent = '<h2>School Information</h2>' +'<table>'+
                    '<tr>'+
                        '<td colspan="2">Name: ' + (feature.properties['name'] !== null ? autolinker.link(feature.properties['name'].toLocaleString()) : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td colspan="2">Grades: ' + (feature.properties['MOE_years'] !== null ? autolinker.link(feature.properties['MOE_years'].toLocaleString()) : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td colspan="2">Gender: ' + (feature.properties['MOE_gender'] !== null ? autolinker.link(feature.properties['MOE_gender'].toLocaleString()) : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td colspan="2">Address: ' + addr + '</td>'+
                    '</tr>';
                    if(feature.properties['email'] !== null){
                        popupContent+= '<tr>'+'<td colspan="2">Email: ' + (feature.properties['email'] !== null ? autolinker.link(feature.properties['email'].toLocaleString()) : '') + '</td>'+'</tr>'
                    }
                    if(feature.properties['religion'] !== null){
                        popupContent+= '<tr>'+'<td colspan="2">Religion: ' + (feature.properties['religion'] !== null ? autolinker.link(feature.properties['religion'].toLocaleString()) : '') + '</td>'+'</tr>'
                    }
                    if(feature.properties['website'] !== null){
                        popupContent+= '<tr>'+'<td colspan="2">Website: ' + (feature.properties['website'] !== null ? autolinker.link(feature.properties['website'].toLocaleString()) : '') + '</td>'+'</tr>'
                    }
                    if(feature.properties['phone'] !== null){
                        popupContent+= '<tr>'+'<td colspan="2">Phone: ' + (feature.properties['phone'] !== null ? autolinker.link(feature.properties['phone'].toLocaleString()) : '') + '</td>'+'</tr>'
                    }
                    

                    // Load notes from notesData
                    feature.properties.note = notesData[feature.properties['osm_id']] || '';


                    popupContent += '<tr><td colspan="2"><label for="notes-' + feature.properties['osm_id'] + '">Notes:</label></td></tr>';
                    popupContent += '<tr><td colspan="2"><textarea id="notes-' + feature.properties['osm_id'] + '" style="width:100%;height:80px;resize:none">' + feature.properties.note + '</textarea></td></tr>';
                    popupContent += '<tr><td colspan="2"><button class="Props" id="saveSchoolButton-' + feature.properties['osm_id'] + '">Save School</button></td></tr>';
                    popupContent += '</table>';

            layer.bindPopup(popupContent, { maxHeight: 450 });

            layer.on('popupopen', function() {
                var saveSchoolButton = document.getElementById('saveSchoolButton-' + feature.properties['osm_id']);
                var notesTextarea = document.getElementById('notes-' + feature.properties['osm_id']);
                var popupContentWrapper = document.querySelector('.leaflet-popup-content-wrapper');
            
                function isSchoolSaved() {
                    return savedSchools.some(function(school) {
                        return school.osm_id === feature.properties.osm_id;
                    });
                }

                saveSchoolButton.textContent = isSchoolSaved() ? 'Unsave School' : 'Save School';


                saveSchoolButton.addEventListener('click', function() {
                    var saveSchoolNotification = document.createElement('div');
                    saveSchoolNotification.className = 'notification';
                    saveSchoolNotification.style.opacity = '0';
                
                    if (isSchoolSaved()) {
                        savedSchools = savedSchools.filter(function(school) {
                            return school.osm_id !== feature.properties.osm_id;
                        });
                        saveSchoolNotification.textContent = 'School removed!';
                        saveSchoolButton.textContent = 'Save School'; // update button text
                    } else { // Save the school to the list
                        var coordinates = layer.getBounds().getCenter();
                        savedSchools.push({
                            note: feature.properties.note,
                            name: feature.properties.name,
                            osm_id: feature.properties.osm_id,
                            lat: coordinates.lat,
                            lng: coordinates.lng
                        })
                        // console.log(savedSchools)
                        // console.log(coordinates)
                        saveSchoolNotification.textContent = 'School saved!';
                        saveSchoolButton.textContent = 'Unsave School'; // update button text
                    }
                
                    popupContentWrapper.appendChild(saveSchoolNotification);
                
                    setTimeout(function() {
                        saveSchoolNotification.style.opacity = '1';
                    }, 500);
                
                    setTimeout(function() {
                        saveSchoolNotification.style.opacity = '0';
                    }, 1750);
                
                    setTimeout(function() {
                        popupContentWrapper.removeChild(saveSchoolNotification);
                    }, 500 + 1750);
                });

                var timeoutId;
                notesTextarea.oninput = function() {
                    clearTimeout(timeoutId);
                    feature.properties.note = notesTextarea.value;
                    notesData[feature.properties['osm_id']] = notesTextarea.value;
            
                    timeoutId = setTimeout(function() {
                        var saveNotification = document.createElement('div');
                        saveNotification.className = 'notification';
                        saveNotification.textContent = 'Note saved!';
                        saveNotification.style.opacity = '0';
                        popupContentWrapper.appendChild(saveNotification);
            
                        setTimeout(function() {
                            saveNotification.style.opacity = '1';
                        }, 500);
            
                        setTimeout(function() {
                            saveNotification.style.opacity = '0';
                        }, 1750);
            
                        setTimeout(function() {
                            popupContentWrapper.removeChild(saveNotification);
                        }, 500 + 1750);
                    }, 1750);
                };
            });
        }

var savedSchoolsButton = document.getElementById('savedSchools');
savedSchoolsButton.addEventListener('click', function() {
    var tableHtml = '';

    if (savedSchools.length === 0) {
        tableHtml = "You haven't saved any schools.";
    } else {
        tableHtml = '<table class="savedSchoolsTable">';
        tableHtml += '<tr>'
            +'<td>School Name</td>'
            +'<td>Note</td>'
            +'<td>Location</td>'
        +'</tr>';
        savedSchools.forEach(function(school, index) {
            tableHtml +=`<tr>
                            <td>${school.name}</td>
                            <td>${school.note}</td>
                            <td><button class='goToSchoolButton' data-lat="${school.lat}" data-lng="${school.lng}" data-index="${index}">Go to school</button></td>
                        </tr>`;
        });
        tableHtml += '</table>';
    }
    console.log(tableHtml);

    var center = map.getCenter();

    var popup = L.popup({ className: 'saved-schools-popup' })
    .setLatLng(center) 
    .setContent(tableHtml)
    .openOn(map);
        
    document.querySelectorAll('.goToSchoolButton').forEach(function(button) {
        button.addEventListener('click', function() {
            var lat = parseFloat(button.getAttribute('data-lat'));
            var lng = parseFloat(button.getAttribute('data-lng'));
            var index = parseInt(button.getAttribute('data-index'));
            console.log("Going to school at lat: ", lat, " lng: ", lng);

            popup.remove();

            var marker = L.marker([lat, lng]).addTo(map);
            map.flyTo([lat, lng], 14);

            marker.bindPopup(savedSchools[index].name).openPopup();

            marker.on('click', function() {
                marker.remove();
            });
        });
    });
})


        map.off('popupopen');

        function style_school_girls_1_0() {
            return {
                pane: 'pane_school_girls_1',
                opacity: 1,
                color: 'rgba(35,35,35,1.0)',
                dashArray: '',
                lineCap: 'butt',
                lineJoin: 'miter',
                weight: 1.0, 
                fill: true,
                fillOpacity: 1,
                fillColor: 'rgba(246,145,255,1.0)',
                interactive: true,
            }
        }
        map.createPane('pane_school_girls_1');
        map.getPane('pane_school_girls_1').style.zIndex = 401;
        map.getPane('pane_school_girls_1').style['mix-blend-mode'] = 'normal';
        var layer_school_girls_1 = new L.geoJson(json_school_girls_1, {
            attribution: '',
            interactive: true,
            dataVar: 'json_school_girls_1',
            layerName: 'layer_school_girls_1',
            pane: 'pane_school_girls_1',
            onEachFeature: pop_school_girls_1,
            style: style_school_girls_1_0,
        });
        bounds_group.addLayer(layer_school_girls_1);
        map.addLayer(layer_school_girls_1);


        //boys school popup
        function pop_school_boys_2(feature, layer) {

            layer.on({ 
                mouseout: function(e) {
                    for (i in e.target._eventParents) {
                        e.target._eventParents[i].resetStyle(e.target);
                    }
                },
                mouseover: highlightFeature,
            });

            var addr = (feature.properties['addr_house'] !== null ? autolinker.link(feature.properties['addr_house'].toLocaleString()) : '') + ' ' + (feature.properties['addr_stree'] !== null ? autolinker.link(feature.properties['addr_stree'].toLocaleString()) : '') + ', Auckland ' + (feature.properties['addr_postc'] !== null ? autolinker.link(feature.properties['addr_postc'].toLocaleString()) : '')
            var popupContent = '<h2>School Information</h2>' +'<table>'+
                    '<tr>'+
                        '<td colspan="2">Name: ' + (feature.properties['name'] !== null ? autolinker.link(feature.properties['name'].toLocaleString()) : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td colspan="2">Grades: ' + (feature.properties['MOE_years'] !== null ? autolinker.link(feature.properties['MOE_years'].toLocaleString()) : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td colspan="2">Gender: ' + (feature.properties['MOE_gender'] !== null ? autolinker.link(feature.properties['MOE_gender'].toLocaleString()) : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td colspan="2">Address: ' + addr + '</td>'+
                    '</tr>';
                    if(feature.properties['email'] !== null){
                        popupContent+= '<tr>'+'<td colspan="2">Email: ' + (feature.properties['email'] !== null ? autolinker.link(feature.properties['email'].toLocaleString()) : '') + '</td>'+'</tr>'
                    }
                    if(feature.properties['religion'] !== null){
                        popupContent+= '<tr>'+'<td colspan="2">Religion: ' + (feature.properties['religion'] !== null ? autolinker.link(feature.properties['religion'].toLocaleString()) : '') + '</td>'+'</tr>'
                    }
                    if(feature.properties['website'] !== null){
                        popupContent+= '<tr>'+'<td colspan="2">Website: ' + (feature.properties['website'] !== null ? autolinker.link(feature.properties['website'].toLocaleString()) : '') + '</td>'+'</tr>'
                    }
                    if(feature.properties['phone'] !== null){
                        popupContent+= '<tr>'+'<td colspan="2">Phone: ' + (feature.properties['phone'] !== null ? autolinker.link(feature.properties['phone'].toLocaleString()) : '') + '</td>'+'</tr>'
                    }
                    

                    // Load notes from notesData
                    feature.properties.note = notesData[feature.properties['osm_id']] || '';


                    popupContent += '<tr><td colspan="2"><label for="notes-' + feature.properties['osm_id'] + '">Notes:</label></td></tr>';
                    popupContent += '<tr><td colspan="2"><textarea id="notes-' + feature.properties['osm_id'] + '" style="width:100%;height:80px;resize:none">' + feature.properties.note + '</textarea></td></tr>';
                    popupContent += '<tr><td colspan="2"><button class="Props" id="saveSchoolButton-' + feature.properties['osm_id'] + '">Save School</button></td></tr>';
                    popupContent += '</table>';

            layer.bindPopup(popupContent, { maxHeight: 450 });


            layer.on('popupopen', function() {
                var saveSchoolButton = document.getElementById('saveSchoolButton-' + feature.properties['osm_id']);
                var notesTextarea = document.getElementById('notes-' + feature.properties['osm_id']);
                var popupContentWrapper = document.querySelector('.leaflet-popup-content-wrapper');
            
                function isSchoolSaved() {
                    return savedSchools.some(function(school) {
                        return school.osm_id === feature.properties.osm_id;
                    });
                }

                saveSchoolButton.textContent = isSchoolSaved() ? 'Unsave School' : 'Save School';


                saveSchoolButton.addEventListener('click', function() {
                    var saveSchoolNotification = document.createElement('div');
                    saveSchoolNotification.className = 'notification';
                    saveSchoolNotification.style.opacity = '0';
                
                    if (isSchoolSaved()) {
                        savedSchools = savedSchools.filter(function(school) {
                            return school.osm_id !== feature.properties.osm_id;
                        });
                        saveSchoolNotification.textContent = 'School removed!';
                        saveSchoolButton.textContent = 'Save School'; // update button text
                    } else {// Save the school to the list
                        var coordinates = layer.getBounds().getCenter();
                        savedSchools.push({
                            note: feature.properties.note,
                            name: feature.properties.name,
                            osm_id: feature.properties.osm_id,
                            lat: coordinates.lat,
                            lng: coordinates.lng
                        })
                        console.log(savedSchools)
                        console.log(coordinates)
                        saveSchoolNotification.textContent = 'School saved!';
                        saveSchoolButton.textContent = 'Unsave School'; 
                    }
                
                    popupContentWrapper.appendChild(saveSchoolNotification);
                
                    setTimeout(function() {
                        saveSchoolNotification.style.opacity = '1';
                    }, 500);
                
                    setTimeout(function() {
                        saveSchoolNotification.style.opacity = '0';
                    }, 1750);
                
                    setTimeout(function() {
                        popupContentWrapper.removeChild(saveSchoolNotification);
                    }, 500 + 1750);
                });

                var timeoutId;
                notesTextarea.oninput = function() {
                    clearTimeout(timeoutId);
                    feature.properties.note = notesTextarea.value;
                    notesData[feature.properties['osm_id']] = notesTextarea.value;
            
                    timeoutId = setTimeout(function() {
                        var saveNotification = document.createElement('div');
                        saveNotification.className = 'notification';
                        saveNotification.textContent = 'Note saved!';
                        saveNotification.style.opacity = '0';
                        popupContentWrapper.appendChild(saveNotification);
            
                        setTimeout(function() {
                            saveNotification.style.opacity = '1';
                        }, 500);
            
                        setTimeout(function() {
                            saveNotification.style.opacity = '0';
                        }, 1750);
            
                        setTimeout(function() {
                            popupContentWrapper.removeChild(saveNotification);
                        }, 500 + 1750);
                    }, 1750);
                };
            });
        }

var savedSchoolsButton = document.getElementById('savedSchools');
savedSchoolsButton.addEventListener('click', function() {
    var tableHtml = '';

    if (savedSchools.length === 0) {
        tableHtml = "You haven't saved any schools.";
    } else {
        tableHtml = '<table class="savedSchoolsTable">';
        tableHtml += '<tr>'
            +'<td>School Name</td>'
            +'<td>Note</td>'
            +'<td>Location</td>'
        +'</tr>';
        savedSchools.forEach(function(school, index) {
            tableHtml +=`<tr>
                            <td>${school.name}</td>
                            <td>${school.note}</td>
                            <td><button class='goToSchoolButton' data-lat="${school.lat}" data-lng="${school.lng}" data-index="${index}">Go to school</button></td>
                        </tr>`;
        });
        tableHtml += '</table>';
    }
    console.log(tableHtml);

    var center = map.getCenter();

    var popup = L.popup({ className: 'saved-schools-popup' })
    .setLatLng(center) 
    .setContent(tableHtml)
    .openOn(map);
        
    document.querySelectorAll('.goToSchoolButton').forEach(function(button) {
        button.addEventListener('click', function() {
            var lat = parseFloat(button.getAttribute('data-lat'));
            var lng = parseFloat(button.getAttribute('data-lng'));
            var index = parseInt(button.getAttribute('data-index'));
            console.log("Going to school at lat: ", lat, " lng: ", lng);

            popup.remove();

            var marker = L.marker([lat, lng]).addTo(map);
            map.flyTo([lat, lng], 14);

            marker.bindPopup(savedSchools[index].name).openPopup();

            marker.on('click', function() {
                marker.remove();
            });
        });
    });
})

        map.off('popupopen');


        function style_school_boys_2_0() {
            return {
                pane: 'pane_school_boys_2',
                opacity: 1,
                color: 'rgba(35,35,35,1.0)',
                dashArray: '',
                lineCap: 'butt',
                lineJoin: 'miter',
                weight: 1.0, 
                fill: true,
                fillOpacity: 1,
                fillColor: 'rgba(97,192,255,1.0)',
                interactive: true,
            }
        }
        map.createPane('pane_school_boys_2');
        map.getPane('pane_school_boys_2').style.zIndex = 402;
        map.getPane('pane_school_boys_2').style['mix-blend-mode'] = 'normal';
        var layer_school_boys_2 = new L.geoJson(json_school_boys_2, {
            attribution: '',
            interactive: true,
            dataVar: 'json_school_boys_2',
            layerName: 'layer_school_boys_2',
            pane: 'pane_school_boys_2',
            onEachFeature: pop_school_boys_2,
            style: style_school_boys_2_0,
        });
        bounds_group.addLayer(layer_school_boys_2);
        map.addLayer(layer_school_boys_2);




        //coed school popup
        function pop_school_coed_3(feature, layer) {

            layer.on({ 
                mouseout: function(e) {
                    for (i in e.target._eventParents) {
                        e.target._eventParents[i].resetStyle(e.target);
                    }
                },
                mouseover: highlightFeature,
            });

            var addr = (feature.properties['addr_house'] !== null ? autolinker.link(feature.properties['addr_house'].toLocaleString()) : '') + ' ' + (feature.properties['addr_stree'] !== null ? autolinker.link(feature.properties['addr_stree'].toLocaleString()) : '') + ', Auckland ' + (feature.properties['addr_postc'] !== null ? autolinker.link(feature.properties['addr_postc'].toLocaleString()) : '')
            var popupContent = '<h2>School Information</h2>' +'<table>'+
                    '<tr>'+
                        '<td colspan="2">Name: ' + (feature.properties['name'] !== null ? autolinker.link(feature.properties['name'].toLocaleString()) : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td colspan="2">Grades: ' + (feature.properties['MOE_years'] !== null ? autolinker.link(feature.properties['MOE_years'].toLocaleString()) : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td colspan="2">Gender: ' + (feature.properties['MOE_gender'] !== null ? autolinker.link(feature.properties['MOE_gender'].toLocaleString()) : '') + '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td colspan="2">Address: ' + addr + '</td>'+
                    '</tr>';
                    if(feature.properties['email'] !== null){
                        popupContent+= '<tr>'+'<td colspan="2">Email: ' + (feature.properties['email'] !== null ? autolinker.link(feature.properties['email'].toLocaleString()) : '') + '</td>'+'</tr>'
                    }
                    if(feature.properties['religion'] !== null){
                        popupContent+= '<tr>'+'<td colspan="2">Religion: ' + (feature.properties['religion'] !== null ? autolinker.link(feature.properties['religion'].toLocaleString()) : '') + '</td>'+'</tr>'
                    }
                    if(feature.properties['website'] !== null){
                        popupContent+= '<tr>'+'<td colspan="2">Website: ' + (feature.properties['website'] !== null ? autolinker.link(feature.properties['website'].toLocaleString()) : '') + '</td>'+'</tr>'
                    }
                    if(feature.properties['phone'] !== null){
                        popupContent+= '<tr>'+'<td colspan="2">Phone: ' + (feature.properties['phone'] !== null ? autolinker.link(feature.properties['phone'].toLocaleString()) : '') + '</td>'+'</tr>'
                    }
                    

                    feature.properties.note = notesData[feature.properties['osm_id']] || '';


                    popupContent += '<tr><td colspan="2"><label for="notes-' + feature.properties['osm_id'] + '">Notes:</label></td></tr>';
                    popupContent += '<tr><td colspan="2"><textarea id="notes-' + feature.properties['osm_id'] + '" style="width:100%;height:80px;resize:none">' + feature.properties.note + '</textarea></td></tr>';
                    popupContent += '<tr><td colspan="2"><button class="Props" id="saveSchoolButton-' + feature.properties['osm_id'] + '">Save School</button></td></tr>';
                    popupContent += '</table>';

            layer.bindPopup(popupContent, { maxHeight: 450 });

            layer.on('popupopen', function() {
                var saveSchoolButton = document.getElementById('saveSchoolButton-' + feature.properties['osm_id']);
                var notesTextarea = document.getElementById('notes-' + feature.properties['osm_id']);
                var popupContentWrapper = document.querySelector('.leaflet-popup-content-wrapper');
            
                function isSchoolSaved() {
                    return savedSchools.some(function(school) {
                        return school.osm_id === feature.properties.osm_id;
                    });
                }

                saveSchoolButton.textContent = isSchoolSaved() ? 'Unsave School' : 'Save School';


                saveSchoolButton.addEventListener('click', function() {
                    var saveSchoolNotification = document.createElement('div');
                    saveSchoolNotification.className = 'notification';
                    saveSchoolNotification.style.opacity = '0';
                
                    if (isSchoolSaved()) {
                        savedSchools = savedSchools.filter(function(school) {
                            return school.osm_id !== feature.properties.osm_id;
                        });
                        saveSchoolNotification.textContent = 'School removed!';
                        saveSchoolButton.textContent = 'Save School'; // update button text
                    } else {// Save the school to the list

                        var coordinates = layer.getBounds().getCenter();
                        savedSchools.push({
                            note: feature.properties.note,
                            name: feature.properties.name,
                            osm_id: feature.properties.osm_id,
                            lat: coordinates.lat,
                            lng: coordinates.lng
                        })
                        console.log(savedSchools)
                        console.log(coordinates)
                        saveSchoolNotification.textContent = 'School saved!';
                        saveSchoolButton.textContent = 'Unsave School';
                    }
                
                    popupContentWrapper.appendChild(saveSchoolNotification);
                
                    setTimeout(function() {
                        saveSchoolNotification.style.opacity = '1';
                    }, 500);
                
                    setTimeout(function() {
                        saveSchoolNotification.style.opacity = '0';
                    }, 1750);
                
                    setTimeout(function() {
                        popupContentWrapper.removeChild(saveSchoolNotification);
                    }, 500 + 1750);
                });

                var timeoutId;
                notesTextarea.oninput = function() {
                    clearTimeout(timeoutId);
                    feature.properties.note = notesTextarea.value;
                    notesData[feature.properties['osm_id']] = notesTextarea.value;
            
                    timeoutId = setTimeout(function() {
                        var saveNotification = document.createElement('div');
                        saveNotification.className = 'notification';
                        saveNotification.textContent = 'Note saved!';
                        saveNotification.style.opacity = '0';
                        popupContentWrapper.appendChild(saveNotification);
            
                        setTimeout(function() {
                            saveNotification.style.opacity = '1';
                        }, 500);
            
                        setTimeout(function() {
                            saveNotification.style.opacity = '0';
                        }, 1750);
            
                        setTimeout(function() {
                            popupContentWrapper.removeChild(saveNotification);
                        }, 500 + 1750);
                    }, 1750);
                };
            });
        }

var savedSchoolsButton = document.getElementById('savedSchools');
savedSchoolsButton.addEventListener('click', function() {
    var tableHtml = '';

    if (savedSchools.length === 0) {
        tableHtml = "You haven't saved any schools.";
    } else {
        tableHtml = '<table class="savedSchoolsTable">';
        tableHtml += '<tr>'
            +'<td>School Name</td>'
            +'<td>Note</td>'
            +'<td>Location</td>'
        +'</tr>';
        savedSchools.forEach(function(school, index) {
            tableHtml +=`<tr>
                            <td>${school.name}</td>
                            <td>${school.note}</td>
                            <td><button class='goToSchoolButton' data-lat="${school.lat}" data-lng="${school.lng}" data-index="${index}">Go to school</button></td>
                        </tr>`;
        });
        tableHtml += '</table>';
    }
    console.log(tableHtml);

    var center = map.getCenter();

    var popup = L.popup({ className: 'saved-schools-popup' })
    .setLatLng(center) 
    .setContent(tableHtml)
    .openOn(map);
        
    document.querySelectorAll('.goToSchoolButton').forEach(function(button) {
        button.addEventListener('click', function() {
            var lat = parseFloat(button.getAttribute('data-lat'));
            var lng = parseFloat(button.getAttribute('data-lng'));
            var index = parseInt(button.getAttribute('data-index'));
            console.log("Going to school at lat: ", lat, " lng: ", lng);

            popup.remove();

            var marker = L.marker([lat, lng]).addTo(map);
            map.flyTo([lat, lng], 14);

            marker.bindPopup(savedSchools[index].name).openPopup();

            marker.on('click', function() {
                marker.remove();
            });
        });
    });
})

        map.off('popupopen');





        function style_school_coed_3_0() {
            return {
                pane: 'pane_school_coed_3',
                opacity: 1,
                color: 'rgba(35,35,35,1.0)',
                dashArray: '',
                lineCap: 'butt',
                lineJoin: 'miter',
                weight: 1.0, 
                fill: true,
                fillOpacity: 1,
                fillColor: 'rgba(175,139,62,1.0)',
                interactive: true,
            }
        }
        map.createPane('pane_school_coed_3');
        map.getPane('pane_school_coed_3').style.zIndex = 403;
        map.getPane('pane_school_coed_3').style['mix-blend-mode'] = 'normal';

        var layer_school_coed_3 = new L.geoJson(json_school_coed_3, {
    attribution: '',
    interactive: true,
    dataVar: 'json_school_coed_3',
    layerName: 'layer_school_coed_3',
    pane: 'pane_school_coed_3',
    onEachFeature: function(feature, layer) {
        if (!feature.properties.note) {
            feature.properties.note = '';
        }
        pop_school_coed_3(feature, layer);
    },
    style: style_school_coed_3_0,
});
        bounds_group.addLayer(layer_school_coed_3);
        map.addLayer(layer_school_coed_3);


    map.on('popupopen', function (e) {
  var layer = e.popup._source;

  // if the layer has a feature property before accessing it, prevents navigation popup error
    if (layer && layer.feature ) {

    var feature = layer.feature;

    // update the textarea with the saved notes
    var notesTextarea = document.getElementById("notes-" + feature.properties['osm_id']);
    
    notesTextarea.value = feature.properties.note;

    // set focus on the textarea
    notesTextarea.focus();
  }
});

        
        
        function pop_park_4(feature, layer) {
            layer.on({
                mouseout: function(e) {
                    for (i in e.target._eventParents) {
                        e.target._eventParents[i].resetStyle(e.target);
                    }
                },
                mouseover: highlightFeature,
            });
            var popupContent = '<table>'
                    if(feature.properties['name'] !== null){
                        popupContent+='<tr><td colspan="2">Name: ' + (feature.properties['name'] !== null ? autolinker.link(feature.properties['name'].toLocaleString()) : '') + '</td>\</tr>'
                    }else{
                        popupContent+='<tr><td colspan="2">Park' + '</td></tr>'
                    }
                    popupContent+='</table>';

            layer.bindPopup(popupContent, {maxHeight: 450});
        }

        function style_park_4_0() {
            return {
                pane: 'pane_park_4',
                opacity: 1,
                color: 'rgba(35,35,35,1.0)',
                dashArray: '',
                lineCap: 'butt',
                lineJoin: 'miter',
                weight: 1.0, 
                fill: true,
                fillOpacity: 1,
                fillColor: 'rgba(138,234,149,1.0)',
                interactive: true,
            }
        }
        map.createPane('pane_park_4');
        map.getPane('pane_park_4').style.zIndex = 404;
        map.getPane('pane_park_4').style['mix-blend-mode'] = 'normal';
        var layer_park_4 = new L.geoJson(json_park_4, {
            attribution: '',
            interactive: true,
            dataVar: 'json_park_4',
            layerName: 'layer_park_4',
            pane: 'pane_park_4',
            onEachFeature: pop_park_4,
            style: style_park_4_0,
        });
        function pop_amenity_parking_5(feature, layer) {
            layer.on({
                mouseout: function(e) {
                    for (i in e.target._eventParents) {
                        e.target._eventParents[i].resetStyle(e.target);
                    }
                },
                mouseover: highlightFeature,
            });
            var popupContent = '<table>\
                    <tr>\
                        <td colspan="2">Parking Space' + '</td>\
                    </tr>\
                </table>';
            layer.bindPopup(popupContent, {maxHeight: 450});
        }

        function style_amenity_parking_5_0() {
            return {
                pane: 'pane_amenity_parking_5',
                opacity: 1,
                color: 'rgba(35,35,35,1.0)',
                dashArray: '',
                lineCap: 'butt',
                lineJoin: 'miter',
                weight: 1.0, 
                fill: true,
                fillOpacity: 1,
                fillColor: 'rgba(53,70,255,1.0)',
                interactive: true,
            }
        }
        map.createPane('pane_amenity_parking_5');
        map.getPane('pane_amenity_parking_5').style.zIndex = 405;
        map.getPane('pane_amenity_parking_5').style['mix-blend-mode'] = 'normal';
        var layer_amenity_parking_5 = new L.geoJson(json_amenity_parking_5, {
            attribution: '',
            interactive: true,
            dataVar: 'json_amenity_parking_5',
            layerName: 'layer_amenity_parking_5',
            pane: 'pane_amenity_parking_5',
            onEachFeature: pop_amenity_parking_5,
            style: style_amenity_parking_5_0,
        });
        function pop_bus_stop_6(feature, layer) {
            layer.on({
                mouseout: function(e) {
                    for (i in e.target._eventParents) {
                        e.target._eventParents[i].resetStyle(e.target);
                    }
                },
                mouseover: highlightFeature,
            });
            var popupContent = '<table>\
                    <tr>\
                        <td colspan="2">Bus Stop' + '</td>\
                    </tr>\
                </table>';
            layer.bindPopup(popupContent, {maxHeight: 450});
        }

        function style_bus_stop_6_0() {
            return {
                pane: 'pane_bus_stop_6',
                radius: 4.0,
                opacity: 1,
                color: 'rgba(35,35,35,1.0)',
                dashArray: '',
                lineCap: 'butt',
                lineJoin: 'miter',
                weight: 1,
                fill: true,
                fillOpacity: 1,
                fillColor: 'rgba(225,89,137,1.0)',
                interactive: true,
            }
        }
        map.createPane('pane_bus_stop_6');
        map.getPane('pane_bus_stop_6').style.zIndex = 406;
        map.getPane('pane_bus_stop_6').style['mix-blend-mode'] = 'normal';
        var layer_bus_stop_6 = new L.geoJson(json_bus_stop_6, {
            attribution: '',
            interactive: true,
            dataVar: 'json_bus_stop_6',
            layerName: 'layer_bus_stop_6',
            pane: 'pane_bus_stop_6',
            onEachFeature: pop_bus_stop_6,
            pointToLayer: function (feature, latlng) {
                var context = {
                    feature: feature,
                    variables: {}
                };
                return L.circleMarker(latlng, style_bus_stop_6_0(feature));
            },
        });
        setBounds();



            
            
        // FILTERING 
        // Check if the target div with class ".filterBtn" exists
        var targetDiv = document.querySelector('.filterBtn');

        // Create a button and set its id
        var button = document.createElement('button');
        button.id = 'filter-btn';
        button.className = 'Props';
        button.innerHTML = 'Filter';
            
        // Append the button to the target div
        targetDiv.appendChild(button);
            
        // Popup for filtering options
        var filterPopup = L.popup({
            closeButton: true,
            closeOnClick: false,
            minWidth: 200,
            autoPan: true
        });

        filterPopup.setContent(
            '<h2>Filter Map</h2>' +
            '<input type="checkbox" id="filter-primary" value="Primary"> Primary Schools<br>' +
            '<input type="checkbox" id="filter-secondary" value="Secondary"> Secondary Schools<br>' +
            '<input type="checkbox" id="filter-other" value="Other"> Other Schools<br>' +
            '<hr>' +
            '<input type="checkbox" id="filter-boys" value="boys"> Boys Schools<br>' +
            '<input type="checkbox" id="filter-girls" value="girls"> Girls Schools<br>' +
            '<input type="checkbox" id="filter-coed" value="coed"> Coed Schools<br>'+
            '<hr>' +
            '<input type="checkbox" id="filter-busstops" value="busstops"> Bus Stops<br>' +
            '<input type="checkbox" id="filter-parks" value="parks"> Parks<br>' +
            '<input type="checkbox" id="filter-parkingspaces" value="parkingspaces"> Parking Spaces<br>'
        );

        button.onclick = function (e) {
            L.DomEvent.stopPropagation(e);
            filterPopup.setLatLng(map.getCenter()).openOn(map);

            //event listeners to filtering checkboxes
            document.getElementById('filter-primary').addEventListener('change', updateSchoolsLayer);
            document.getElementById('filter-secondary').addEventListener('change', updateSchoolsLayer);
            document.getElementById('filter-other').addEventListener('change', updateSchoolsLayer);
            document.getElementById('filter-boys').addEventListener('change', updateSchoolsLayer);
            document.getElementById('filter-girls').addEventListener('change', updateSchoolsLayer);
            document.getElementById('filter-coed').addEventListener('change', updateSchoolsLayer);
            document.getElementById('filter-busstops').addEventListener('change', updateMap);
            document.getElementById('filter-parks').addEventListener('change', updateMap);
            document.getElementById('filter-parkingspaces').addEventListener('change', updateMap);
        };

        // When the map is clicked, close the popup
        map.on('click', function(e) {
            filterPopup.removeFrom(map);
        });

        // When the popup is clicked, stop the map click event from firing
        button.addEventListener('click', function(e) {
            L.DomEvent.stopPropagation(e);
        });

function updateMap() {
     var busstops = document.getElementById('filter-busstops').checked
     var parks = document.getElementById('filter-parks').checked
     var parkingspaces = document.getElementById('filter-parkingspaces').checked
    
    if (busstops) {
        layer_bus_stop_6.addTo(map);
    } else {
        map.removeLayer(layer_bus_stop_6)
     }

     if (parks) {
        layer_park_4.addTo(map);
    } else {
        map.removeLayer(layer_park_4)
     }
     if (parkingspaces) {
        layer_amenity_parking_5.addTo(map);
    } else {
        map.removeLayer(layer_amenity_parking_5)
     }

}


function updateSchoolsLayer() {
    var schoolType = {
        Primary: document.getElementById('filter-primary').checked,
        Secondary: document.getElementById('filter-secondary').checked,
        Other: document.getElementById('filter-other').checked
    };
    var genderType = {
        boys: document.getElementById('filter-boys').checked,
        girls: document.getElementById('filter-girls').checked,
        coed: document.getElementById('filter-coed').checked
    };
   
    var layers = [layer_school_girls_1, layer_school_boys_2, layer_school_coed_3];
    layers.forEach(function (layerGroup) {
        layerGroup.eachLayer(function (layer) {
            if (layer.feature.properties['MOE_years'] !== null && layer.feature.properties['MOE_gender'] !== null) {
                var currentSchoolType = 'Other';
                if (layer.feature.properties['MOE_years'].includes("1-6") || layer.feature.properties['MOE_years'].includes("1-8")) {
                    currentSchoolType = 'Primary';
                } else if (layer.feature.properties['MOE_years'].includes("7-13") || layer.feature.properties['MOE_years'].includes("9-13")) {
                    currentSchoolType = 'Secondary';
                }

                var isVisible = (schoolType[currentSchoolType] || Object.values(schoolType).every(v => !v)) &&
                                (genderType[layer.feature.properties['MOE_gender']] || Object.values(genderType).every(v => !v)) ;

                if (isVisible) {
                    layer.addTo(map);
                } else {
                    map.removeLayer(layer);
                }
            }
        });
    });
}

var targetDiv = document.querySelector('.centreBtn');

var button = document.createElement('button');
button.id = 'center-auckland-btn';
button.className = 'Props';
button.innerHTML = 'Center Map';

targetDiv.appendChild(button);

button.onclick = function (e) {
    L.DomEvent.stopPropagation(e);
    // set the map view to the center of Auckland, zoom level of 12
    map.setView([-36.8485, 174.7633], 12);
};
//----------------------------------------------------

//Starting point dropdown
function searchOpenCage(query, callback) {
  const apiKey = 'ecfdbf092fe54c139d294aefa28ec4bd'; //OpenCage
  const apiUrl = `https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${query}&limit=5&countrycode=nz&proximity=-36.8485,174.7633`;

  $.getJSON(apiUrl, function(data) {
    const results = data.results
      .filter(function(result) {
        //Check if the result's components contain 'Auckland' as the city, state, or state_district
        return (
          result.components.city === 'Auckland' ||
          result.components.state === 'Auckland' ||
          result.components.state_district === 'Auckland'
        );
      })
      .map(function(result) {
        return {
          label: result.formatted,
          value: result.geometry
        };
      });

    callback(results);
  });
}


function initOpenCageAutocomplete() {
  $("#starting-address").autocomplete({
    minLength: 3,
    source: function(request, response) {
        // console.log('Autocomplete source function called with term:', request.term); 
      searchOpenCage(request.term, response);
    },
    select: function(event, ui) {
      $("#starting-address").val(ui.item.label);
      $("#starting-address").data("coordinates", ui.item.value);
      return false;
    }
  });
}



// destination dropdown

var layers = [layer_school_girls_1, layer_school_boys_2, layer_school_coed_3];
var schoolNames = [];

// populates the dropdown with school names
function populateSchoolDropdown(dropdown) {
//   console.log('Populating dropdown...'); 
  layers.forEach(function (layerGroup) {
    // console.log('Layer group:', layerGroup); 
    layerGroup.eachLayer(function (layer) {
    //   console.log('Layer:', layer); 
      if (layer.feature && layer.feature.properties && typeof layer.getBounds === 'function') {
        var option = document.createElement("option");
        var coordinates = layer.getBounds().getCenter(); // center coordinates of the polygon
        option.value = JSON.stringify(coordinates); // coordinates as a JSON string
        option.text = layer.feature.properties['name']; // name of school
        dropdown.add(option);
      }
    });
  });
}

function initSchoolAutocomplete() {
  schoolNames = []; // clear the schoolNames array
  isDropdownPopulated = false;
  isStartingAddressAutocompleteInitialized = false;

  layers.forEach(function (layerGroup) {
    layerGroup.eachLayer(function (layer) {
      if (layer.feature && layer.feature.properties && typeof layer.getBounds === 'function') {
        var name = layer.feature.properties['name'];
        var coordinates = layer.getBounds().getCenter();
        schoolNames.push({label: name, value: JSON.stringify(coordinates)});
      }
    });
  });

//   console.log('School Names:', schoolNames);

  $("#school-autocomplete").autocomplete({
    source: function(request, response) {
      var term = request.term.toLowerCase(); 
      var results = schoolNames.filter(function(school) {
        return school.label.toLowerCase().startsWith(term);
      });
      response(results.slice(0, 5)); // limit to 5 results
    },
    minLength: 1,
    select: function (event, ui) {
    //   console.log('Autocomplete select function called with item:', ui.item); 
      $("#school-autocomplete").val(ui.item.label);
      $("#school-autocomplete").data('coordinates', ui.item.value);
      return false;
    }
  });
//   console.log('Autocomplete initialized');
}


// if false populate or init
var isDropdownPopulated = false;
var isStartingAddressAutocompleteInitialized = false;
let hasRoute = false;

function initCalculateRouteBtn() {
  $("#calculate-route-btn").off('click').click(function() { // Add .off('click') before .click()
    const startingCoordinates = $("#starting-address").data("coordinates");
    const destinationCoordinates = JSON.parse($("#school-autocomplete").data("coordinates"));

    // console.log('Starting Coordinates:', startingCoordinates);
    // console.log('Destination Coordinates:', destinationCoordinates);

    calculateRoute(startingCoordinates, destinationCoordinates);
        // set the flag to true when there is a route on the map
        hasRoute = true;
  });
}

// navigation control
// navigation control
// var navigationControl = L.Control.extend({
//     options: {
//         position: 'topright' // Change the position to 'topright'
//     },
//     onAdd: function (map) {
//         // Check if the target div with class "mapProps" exists
//         var targetDiv = document.querySelector('.mapProps');
      
//         // Create a button and set its id
//         var button = document.createElement('button');
//         button.id = 'navigation-btn';
//         button.innerHTML = 'Navigate';
      
//         // Append the button to the target div
//         targetDiv.appendChild(button);

//         // popup for navigation interface
//         var navigationPopup = L.popup({
//             closeButton: true,
//             closeOnClick: false,
//             minWidth: 200,
//             autoPan: true
//         });

//     navigationPopup.setContent(
//       '<h2>Navigation Interface</h2>' +
//       '<p>Starting point:</p>' +
//       '<input type="text" id="starting-address" placeholder="Starting address">' +
//       '<p>Select a school to navigate to:</p>' +
//       '<input type="text" id="school-autocomplete" placeholder="Type a school">'+
//       '<button id="calculate-route-btn">Navigate</button>'
//     );

//     container.onclick = function (e) {
//       L.DomEvent.stopPropagation(e);

//       if (e.target.id === "navigation-btn") { // check if the clicked element has an id of "navigation-btn"
//         navigationPopup.setLatLng(map.getCenter()).openOn(map);

//         isDropdownPopulated = false;
//         isStartingAddressAutocompleteInitialized = false;

//         // console.log('isDropdownPopulated:', isDropdownPopulated);
//         // console.log('isStartingAddressAutocompleteInitialized:', isStartingAddressAutocompleteInitialized);

//         initCalculateRouteBtn();

//         // initialize the autocomplete only if it hasn't been initialized before
//         if (!isDropdownPopulated) {
//           initSchoolAutocomplete();
//           isDropdownPopulated = true;
//         }

//         // initialize the starting address autocomplete only if it hasn't been initialized before
//         if (!isStartingAddressAutocompleteInitialized) { 
//           initOpenCageAutocomplete();
//           isStartingAddressAutocompleteInitialized = true;
//         }
//       }
//     };

//     // When the map is clicked, close the popup
//     map.on('click', function(e) {
//       navigationPopup.removeFrom(map);
//     });

//     // When the popup is clicked, stop the map click event from firing
//     container.addEventListener('click', function(e) {
//       L.DomEvent.stopPropagation(e);
//     });

//     return container;
//   }
// });

// map.addControl(new navigationControl());

var targetDiv = document.querySelector('.navButton');


var button = document.createElement('button');
button.id = 'navigation-btn';
button.className = 'Props'
button.innerHTML = 'Navigate';


targetDiv.appendChild(button);

// popup for navigation interface
var navigationPopup = L.popup({
    closeButton: true,
    closeOnClick: false,
    minWidth: 200,
    autoPan: true
});

navigationPopup.setContent(
    '<h2>Navigation</h2>' +
    '<p>Starting point:</p>' +
    '<input type="text" id="starting-address" placeholder="Starting address">' +
    '<p>Select a school to navigate to:</p>' +
    '<input type="text" id="school-autocomplete" placeholder="Type a school">'+
    '<button id="calculate-route-btn">Navigate</button>'
);

button.onclick = function (e) {
    L.DomEvent.stopPropagation(e);

    navigationPopup.setLatLng(map.getCenter()).openOn(map);
    isDropdownPopulated = false;
    isStartingAddressAutocompleteInitialized = false;

    initCalculateRouteBtn();

    // initialize the autocomplete only if it hasn't been initialized before
    if (!isDropdownPopulated) {
        initSchoolAutocomplete();
        isDropdownPopulated = true;
    }

    // initialize the starting address autocomplete only if it hasn't been initialized before
    if (!isStartingAddressAutocompleteInitialized) { 
        initOpenCageAutocomplete();
        isStartingAddressAutocompleteInitialized = true;
    }


};

// When the map is clicked, close the popup
map.on('click', function(e) {
    navigationPopup.removeFrom(map);
});

// When the popup is clicked, stop the map click event from firing
button.addEventListener('click', function(e) {
    L.DomEvent.stopPropagation(e);
});


//Routing
map.createPane("routePane");
map.getPane("routePane").style.zIndex = 500;

const routeLayerGroup = L.layerGroup().addTo(map);
let routePolyline;



function drawRoute(coordinates) {
//   console.log("drawRoute function called");

  if (routePolyline) {
    map.removeLayer(routePolyline);
  }

  const latLngs = coordinates.map(coord => [coord[0], coord[1]]);
//   console.log('LatLngs used for drawing route:', latLngs);

  const polylineOptions = {
    color: "red",
    weight: 5,
    opacity: 1,
    pane: "routePane" // pane
  };

  routePolyline = L.polyline(latLngs, polylineOptions);
  routePolyline.addTo(map);

  map.fitBounds(routePolyline.getBounds());

//   console.log("Polyline:", routePolyline);
}


function displayRoute(route) {
    // console.log("displayRoute function called");
  const coordinates = route.geometry.coordinates;

  // fix coordinates by swapping latitude and longitude
  const fixedRouteCoordinates = coordinates.map(coord => [coord[1], coord[0]]);

//   console.log('Fixed Route Coordinates:', fixedRouteCoordinates);

const endMarker = L.marker(fixedRouteCoordinates[fixedRouteCoordinates.length - 1]).addTo(map);

  // fixedRouteCoordinates for creating the polyline.
  const polyline = L.polyline(fixedRouteCoordinates, {color: 'blue'}).addTo(map);
  map.fitBounds(polyline.getBounds());
  drawRoute(fixedRouteCoordinates); // drawRoute function with the fixed coordinates

  const clearRouteBtn = document.createElement("button");
  clearRouteBtn.className = "Props"
clearRouteBtn.innerHTML = "Clear Route";
clearRouteBtn.addEventListener("click", clearRoute);

if (!document.querySelector("#clear-route-btn")) {
  const container = document.querySelector(".navButton");
  container.appendChild(clearRouteBtn);
  clearRouteBtn.id = "clear-route-btn";
}

function clearRoute() {
  if (routePolyline) {
    map.removeLayer(routePolyline);
  }
  if (endMarker) {
    map.removeLayer(endMarker);
  }
  if (document.querySelector("#clear-route-btn")) {
    document.querySelector("#clear-route-btn").remove();
  }
}


}

async function calculateRoute(startingCoordinates, destinationCoordinates) {
    // console.log("calculateRoute function called"); 
    let routeLayer, schoolMarker;

  const apiKey = "5b3ce3597851110001cf6248e5c0ff4ac4be4727bba49f8234b6e956"; // OpenRouteService API key
  const apiUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startingCoordinates.lng},${startingCoordinates.lat}&end=${destinationCoordinates.lng},${destinationCoordinates.lat}&overview=full`;

//   console.log('Starting:', startingCoordinates, 'Destination:', destinationCoordinates);

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    // console.log('Route data:', data); //response data
    displayRoute(data.features[0]);
  } catch (error) {
    console.error('Error fetching route:', error);
  }
  navigationPopup.remove();
}
        

//search bar

var searchControl = L.Control.geocoder({  
            defaultMarkGeocode: true,
            position:'topleft',
            placeholder: "Search for schools"
        
}).addTo(map);  



//variable for the marker
var marker;

function initSearchBarAutocomplete() {
  var schoolNames = [];

  // populate the schoolNames array
  layers.forEach(function (layerGroup) {
    layerGroup.eachLayer(function (layer) {
      if (layer.feature && layer.feature.properties && typeof layer.getBounds === 'function') {
        var name = layer.feature.properties['name'];
        var coordinates = layer.getBounds().getCenter();
        schoolNames.push({label: name, value: JSON.stringify(coordinates)});
      }
    });
  });

//   console.log('School Names:', schoolNames);

  // initialize the autocomplete for the search bar
  $("input[placeholder='Search for schools']").autocomplete({
      source: function(request, response) {
      var term = request.term.toLowerCase();
      var results = schoolNames.filter(function(school) {
        return school.label.toLowerCase().startsWith(term);
      });
      response(results.slice(0, 5)); // limit to 5 results
    },
    minLength: 1,
    select: function (event, ui) {
    //   console.log('Autocomplete select function called with item:', ui.item); 
      $("#search-bar").val(ui.item.label);
      $("#search-bar").data('coordinates', ui.item.value);

      // remove the previous marker
      if (marker) {
        map.removeLayer(marker);
      }

      // add the new marker
      var coords = JSON.parse(ui.item.value);
      marker = L.marker([coords.lat, coords.lng]).addTo(map);

      // center the map on the new marker
      map.panTo(new L.LatLng(coords.lat, coords.lng));

      // add a click event to the marker to remove it when clicked
      marker.on('click', function() {
        map.removeLayer(marker);
        marker = null;
      });

      return false;
    }
  });

//   console.log('Search bar autocomplete initialized');
}
initSearchBarAutocomplete();