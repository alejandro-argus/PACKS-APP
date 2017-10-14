import { Component } from '@angular/core';
import {ViewController} from "ionic-angular";
import { Camera,CameraOptions } from '@ionic-native/camera';


@Component({
  selector: 'page-subir',
  templateUrl: 'subir.html',
})
export class SubirPage {

  descripcion:string= '';
  imagenPreview:string;

  constructor(private viewCtrl: ViewController, private camara:Camera) {
  }

  cerrar_modal(){
    this.viewCtrl.dismiss();
  }

  mostrar_camara(){

    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camara.DestinationType.DATA_URL,
      encodingType: this.camara.EncodingType.JPEG,
      mediaType: this.camara.MediaType.PICTURE
    }
    
    this.camara.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     this.imagenPreview = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
     console.log("ERROR EN CAMARA",JSON.stringify(err))
    });
    
  }


}
