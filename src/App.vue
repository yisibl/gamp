<template>
  <div class="app-panel">
    <div class="settings-panel">
      <h1>Map information</h1> Map center 纬度:
      <input type="number" v-model="center.lat" number>
      <button @click="geolocate">获取当前位置</button>
      <br> Map center 经度:
      <input type="number" v-model="center.lng" number>
      <br> Map zoom:
      <input type="number" v-model="zoom" number>
      <h1>Circle 范围</h1>
        Visible: <input type="checkbox" number v-model="displayCircle"><br>
        {{circleBounds}}
      <br> Dragged {{drag}} times
      <br> Left clicked {{mapClickedCount}} times

      <br> Enable scrollwheel zooming on the map:
      <input type="checkbox" v-model="scrollwheel">
      <br>
      <button @click="addMarker"> Add a new Marker</button> (or right click on the map :) )
      </br>
      Grid size:
      <input type="number" v-model="gridSize" number>
      <br>

      <h1>PlaceInput</h1>
      <place-input label="Add a marker at this place" :select-first-on-enter="true" @g-place_changed="updatePlace($event)"></place-input>
      <br>
      <h1> Standalone infoWindow </h1> modal 1 :
      <input type="checkbox" number v-model="ifw">
      <br> modal 2:
      <input type="checkbox" number v-model="ifw2">
      <input type="text" v-model="ifw2text">
      <h1>Markers</h1> Display only markers with even ID (to test filters)
      <input type="checkbox" number v-model="markersEven">
      <br>
      <table>
        <tr>
          <th>lat</th>
          <th>lng</th>
          <th>opacity</th>
          <th>enabled</th>
          <th>draggable</th>
          <th>clicked</th>
          <th>right clicked</th>
          <th>Drag-ended</th>
          <th>Open info window</th>
          <th>infoWIndow text</th>
          <th>Delete me</th>
        </tr>
        <tr v-for="m in markers">
          <td>
            <input type="number" v-model="m.position.lat" number>
          </td>
          <td>
            <input type="number" v-model="m.position.lng" number>
          </td>
          <td>
            <input type="number" v-model="m.opacity" number>
          </td>
          <td>
            <input type="checkbox" v-model="m.enabled" number>
          </td>
          <td>
            <input type="checkbox" v-model="m.draggable" number>
          </td>
          <td>{{m.clicked}}</td>
          <td>{{m.rightClicked}}</td>
          <td>{{m.dragended}}</td>
          <td>
            <input type="checkbox" v-model="m.ifw" number>
          </td>
          <td>
            <input type="text" v-model="m.ifw2text">
          </td>
          <td>
            <button @click="markers.splice(markers.indexOf(m), 1)">Delete me </button>
          </td>
        </tr>
      </table>
    </div>
    <div class="map-panel">
      <gmap-map
          :center="center"
          :zoom="zoom"
          :map-type-id="mapType"
          :options="{styles: mapStyles, scrollwheel: scrollwheel}"
          @g-rightclick="mapRclicked"
          @g-drag="drag++"
          @g-click="mapClickedCount++"

          @g-zoom_changed="update('zoom', $event)"
          @g-center_changed="update('center', $event)"
          @g-maptypeid_changed="update('mapType', $event)"
          @g-bounds_changed="update('bounds', $event)"
          >
          <!-- <gmap-cluster
          :grid-size="gridSize"
          v-if="clustering"
          >
            <gmap-marker
              v-if="m.enabled"
              :position="m.position"
              :opacity="m.opacity"
              :draggable="m.draggable"
              @g-click="m.clicked++"
              @g-rightclick="m.rightClicked++"
              @g-dragend="m.dragended++"

              @g-position_changed="updateChild(m, 'position', $event)"

              v-for="m in activeMarkers"
            >
            <gmap-info-window
            :opened.sync="m.ifw"
            :content="m.ifw2text"
            ></gmap-info-window>
            </gmap-marker>
          </gmap-cluster> -->

          <div>
            <gmap-marker
            v-if="m.enabled"
            :position="m.position"
            :opacity="m.opacity"
            :draggable="m.draggable"
            @g-click="m.clicked++"
            @g-rightclick="m.rightClicked++"
            @g-dragend="m.dragended++"
            @g-position_changed="updateChild(m, 'position', $event)"
            v-for="m in activeMarkers"
            >
              <gmap-info-window
              :opened.sync="m.ifw"
              :content="m.ifw2text"
              ></gmap-info-window>
            </gmap-marker>
          </div>

          <gmap-info-window
          :position="center"
          :opened.sync="ifw"
          >
          To show you the bindings are working I will stay on the center of the screen whatever you do :)
          <br/>
          To show you that even my content is bound to vue here is the number of time you clicked on the map
          <b>{{mapClickedCount}}</b>
          </gmap-info-window>

          <gmap-info-window
          :position="center"
          :opened.sync="ifw2"
          :content="ifw2text"
          ></gmap-info-window>

          <gmap-circle v-if="displayCircle" :bounds="circleBounds"
                :center="center" :radius="100000"
                :options="{editable: true}"

                @g-radius_changed="updateCircle('radius', $event)"
                @g-bounds_changed="updateCircle('bounds', $event)"

                ></gmap-circle>
        </gmap-map>
    </div>
  </div>
</template>
<style>
.app-panel {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
}

.map-panel {
  flex: 1 1 40%;
}

.settings-panel {
  overflow-y: scroll;
  flex: 1 0 500px;
}

gmap-map {
  width: 100%;
  height: 600px;
  display: block;
}
</style>
<script>
import { load, Marker, Map, InfoWindow, Circle, PlaceInput } from 'vue2-google-maps'
load({
  key: 'AIzaSyBzlLYISGjL_ovJwAehh6ydhB56fCCpPQw',
  v: '3.24',
  libraries: ['places'],
  language: 'zh-CN'
})
export default {
  data: function data() {
    return {
      center: {
        lat: 31.3,
        lng: 121.4
      },
      mapBounds: {},
      circleBounds: {},
      displayCircle: false,
      zoom: 8,
      gridSize: 50,
      markers: [],
      markersEven: false,
      drag: 0,
      mapClickedCount: 0,
      ifw: true,
      ifw2: false,
      ifw2text: 'You can also use the content prop to set your modal',
      pleditable: true,
      plvisible: false,
      pgvisible: false,
      scrollwheel: true
    }
  },
  computed: {
    activeMarkers() {
      if (this.markersEven) {
        return this.markers.filter(
          (v, k) => k % 2 === 0
        )
      } else {
        return this.markers
      }
    }
  },
  methods: {
    mapClicked(mouseArgs) {
      console.log('map clicked', mouseArgs)
    },
    // 获取当前位置
    geolocate: function geolocate() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          console.log(geolocation)
        })
      }
    },
    mapRclicked(mouseArgs) {
      const createdMarker = this.addMarker()
      createdMarker.position.lat = mouseArgs.latLng.lat()
      createdMarker.position.lng = mouseArgs.latLng.lng()
    },
    addMarker: function addMarker() {
      this.markers.push({
        position: {
          lat: 31.3,
          lng: 121.4
        },
        opacity: 1,
        draggable: true,
        enabled: true,
        clicked: 0,
        rightClicked: 0,
        dragended: 0,
        ifw: true,
        ifw2text: 'This text is bad please change me :( '
      })
      return this.markers[this.markers.length - 1]
    },
    update(field, event) {
      if (field === 'center') {
        console.log('CENTER REPORTED', event)
        this.center = {
          lat: event.lat(),
          lng: event.lng()
        }
      } else if (field === 'bounds') {
        this.mapBounds = event
      } else {
        this.$set(this, field, event)
      }
    },
    updateChild(object, field, event) {
      if (field === 'position') {
        object.position = {
          lat: event.lat(),
          lng: event.lng()
        }
      }
    },
    updateCircle(prop, value) {
      if (prop === 'radius') {
        this.radius = value
      } else if (prop === 'bounds') {
        this.circleBounds = value
      }
    },
    updatePlace(place) {
      if (place && place.geometry && place.geometry.location) {
        var marker = this.addMarker()
        marker.position.lat = place.geometry.location.lat()
        marker.position.lng = place.geometry.location.lng()
      }
    }
  },
  components: {
    GmapMap: Map,
    GmapMarker: Marker,
    GmapInfoWindow: InfoWindow,
    GmapCircle: Circle,
    PlaceInput: PlaceInput
  }
}
</script>
