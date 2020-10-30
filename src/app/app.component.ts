import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import {} from 'googlemaps';
import { VirtualTimeScheduler } from 'rxjs';
import { ComunasRestService } from './core/api/comunasRest.service';
import { FarmaciasRestService } from './core/api/farmaciasRest.service';
import { Farmacia } from 'src/app/core/models/farmacias';
import { MarkersService } from './services/markers.service';
import  MarkerClusterer from '@googlemaps/markerclustererplus';
import { CommonConstants } from './core/models/commonConstants';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [FarmaciasRestService,ComunasRestService]
})

export class AppComponent implements OnInit{ 
  @ViewChild('map', {static: true}) mapElement: any;
  map: google.maps.Map;
  infoWindow: google.maps.InfoWindow;
  title = 'farmacias-de-turno-rm';
  comunasRest: ComunasRestService;
  farmaciasRest: FarmaciasRestService;
  markersService: MarkersService;
  options :string;
  markers: google.maps.Marker[];
  constructor(injector: Injector){
    
    this.markers=[];
    this.comunasRest = injector.get(ComunasRestService);
    this.farmaciasRest = injector.get(FarmaciasRestService);
    this.markersService = injector.get(MarkersService);
  }
 
/*
* Configuracion Inicial
*/
  async ngOnInit(): Promise<void> {
    //Dropdown options
    this.options= await this.comunasRest.getComunasPorIdregionUsingPOST(7, 'body').toPromise();
    var opciones = document.getElementById('comunas');
    opciones.insertAdjacentHTML('afterbegin',this.options);

    //Propiedades del mapa
    const mapProperties = {
         center: new google.maps.LatLng(-33.4488895,-70.6712257),
         zoom: 8,
         mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    //Instanciacion del mapa
    this.map = new google.maps.Map(this.mapElement.nativeElement,    mapProperties);
    //Inject LocationButton
    this.injectLocationButton();
    //Request para traer todas las farmacias de turno
    var farmaciasRm = await this.farmaciasRest.getFarmaciasPorIdregionUsingGET(7).toPromise();
    //Primer llenado de mapa
    this.setMarkersFromFarmaciasList(farmaciasRm,true);
  }



/*
* Inserta un boton en el mapa para centrarlo en la ubicacion actual. La api de google no provee de forma nativa este boton.
*/
injectLocationButton(){
  var locationButton= this.getLocationButton();
  //Se inserta el boton de usar mi ubicacion en el mapa
  this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    //Limpia los marcadores al dar click al boton "usar ubicacion actual"
    this.borrarMarkers();
    // Si el navegador permite acceso a la ubicacion, se centra el mapa en esta y se añade un marcador de posicion actual.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: Position) => {
          const pos = new google.maps.LatLng(position.coords.latitude,position.coords.longitude)
          //Propiedades del marcador de posicion actual
          const marker = new google.maps.Marker({
            position: pos,
            icon: "../assets/icons/icon-location-2.png",
            map:this.map,
            animation: google.maps.Animation.BOUNCE,
            title: "Ubicación actual",
          });
          this.myLocationMarker(marker,pos);
          
        },
        () => {
          this.handleLocationError(true, this.infoWindow, this.map.getCenter());
        }
      );
    } else {
      // Si el navegador no lo permite, se notifica con un error
      this.handleLocationError(false, this.infoWindow, this.map.getCenter());
    }
  });
}


/*
* Error En el caso que el navegador no permita geolocalizacion
*/
 handleLocationError(browserHasGeolocation: boolean,
  infoWindow: google.maps.InfoWindow,
  pos: google.maps.LatLng
  ) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: No se ha podido acceder a tu ubicación."
      : "Error: Tu navegador no soporta el servicio de geolocalizacion de Google."
  );
  infoWindow.open(this.map);
}



/*
*Comportamiento del selector de Comunas
*/
  async onSelectChange(selectedId) {
    if(selectedId!=0){
      var farmaciasPorComuna = await this.farmaciasRest.getFarmaciasDeTurnoPorIdComunaUsingGET(selectedId).toPromise();
      await this.borrarMarkers();
      if(farmaciasPorComuna){
      await this.setMarkersFromFarmaciasList(farmaciasPorComuna);
      }
    }
}


/*
*Refresca el mapa
*/
public refreshMap(mapProperties: any){
//Instanciacion del mapa
this.map = new google.maps.Map(this.mapElement.nativeElement,    mapProperties);
this.injectLocationButton();
}


/*
* Inserta los Markers filtrados generando los nuevos clusters de Markers
*/
public setMarkersFromFarmaciasList(farmacias: Array<Farmacia>,inicial?: boolean){
  //Crea un nuevo cluster de Markadores
  //Propiedades del mapa
  var center;
  var zoom;
  if(inicial){
    center= new google.maps.LatLng(-33.4488895,-70.6712257)
    zoom = 8
  }else{
    center=new google.maps.LatLng(farmacias[0].localLat,farmacias[0].localLng);
    zoom= 14
  }
   const mapProperties = {
    center: center,
    zoom: zoom,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  this.refreshMap(mapProperties);
  this.borrarMarkers();
  var markerCluster = new MarkerClusterer(this.map, [], {
    imagePath: 'assets/icons/m'
  });
  for( let index = 0; index<farmacias.length;index++){
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(farmacias[index].localLat,farmacias[index].localLng),
      icon: "../assets/icons/icon-pills-2.png",
      map:this.map,
      animation: google.maps.Animation.BOUNCE,
    });
    marker.addListener("click", () => {
      var infowindow = this.appendInfoWindowToMarker(farmacias[index]);
      infowindow.open(this.map, marker);
  });
    markerCluster.addMarker(marker);
    this.markers.concat(marker);
  }
}

/*
*Vacia los Markers del Mapa
*/
private async borrarMarkers(){
  for (let i = 0; i < this.markers.length; i++) {
    this.markers[i].setMap(null);
  }
  this.markers = [];
}

/*
* Setea el Marker de la ubicacion actual
*/
private myLocationMarker(marker: google.maps.Marker,latLng: google.maps.LatLng){
  this.borrarMarkers();
  this.markers.push(marker)
  this.map.setCenter(latLng);
  this.map.setZoom(16);
}



private getLocationButton():any{
  //Creacion de boton para acceder a ubicacion actual ( no es una opcion propia de la Api de google maps)
  const locationButton = document.createElement("button");
  locationButton.textContent = "Usar mi ubicación";
  locationButton.classList.add("custom-map-control-button");
  // CSS del boton
  locationButton.style.backgroundColor = "#fff";
  locationButton.style.border = "2px solid #fff";
  locationButton.style.borderRadius = "3px";
  locationButton.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  locationButton.style.cursor = "pointer";
  locationButton.style.marginBottom = "22px";
  locationButton.style.textAlign = "center";
  locationButton.title = "Usar mi ubicación actual";
  locationButton.style.color = "rgb(25,25,25)";
  locationButton.style.fontFamily = "Roboto,Arial,sans-serif";
  locationButton.style.fontSize = "16px";
  locationButton.style.lineHeight = "38px";
  locationButton.style.paddingLeft = "5px";
  locationButton.style.paddingRight = "5px";
  return locationButton;
}


public appendInfoWindowToMarker(farmacia: Farmacia): google.maps.InfoWindow{
  return new google.maps.InfoWindow({
      content: CommonConstants.contentHeader+
      CommonConstants.contentNombre+"Farmacia de turno"+
      CommonConstants.contentTableNombreLocal+farmacia.nombreLocal+
      CommonConstants.contentTableDireccion+farmacia.direccion+
      CommonConstants.contentTableTelefono+farmacia.telefono+
      CommonConstants.contentTableFooter
  });;
}
}