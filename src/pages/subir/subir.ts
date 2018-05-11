import { Component } from '@angular/core';
import {ViewController} from "ionic-angular";
import { Camera,CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';

import{CargaArchivoProvider} from '../../providers/carga-archivo/carga-archivo'
import { AndroidPermissions } from '@ionic-native/android-permissions';





@Component({
  selector: 'page-subir',
  templateUrl: 'subir.html',
})
export class SubirPage {

  descripcion:string= '';
  imagenPreview:string;
  imagen64:string;

  constructor(private viewCtrl: ViewController, 
              private camara:Camera, 
              private imagePicker: ImagePicker, 
              public _cargaArchivo:CargaArchivoProvider,
              private androidPermissions: AndroidPermissions ) {
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
     this.imagen64 = imageData;
    }, (err) => {
     // console.log("ERROR EN CAMARA",JSON.stringify(err))WW
     this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
    });
    
  }

  pedir_permisos(){

    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      (result) => {
        if(result.hasPermission){
          this.mostrar_camara()
        }
        else{
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA).then(
            (result) => {
              if(result.hasPermission){
                this.mostrar_camara()
              }
            },
            (err) =>{
              this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA).then
            } 
          );

        }
      },
      (err) =>{
      
      } 
    );
  }

  

  seleccionar_foto(){
    let opciones:ImagePickerOptions = {
      quality: 70,
      outputType: 1,
      maximumImagesCount: 1
    }


    this.imagePicker.getPictures(opciones).then((results) => {
      for (var i = 0; i < results.length; i++) {
        this.imagenPreview = 'data:image/jpeg;base64,' + results[i];
        this.imagen64 = results[i];
      }
    }, (err) => {
      console.log("ERROR EM SELECTOR DE IMAGENES",JSON.stringify(err))
     });
  }
  

  crear_post(){

    let archivo = {
      img: this.imagen64,
      titulo: this.descripcion,
    }

    

  
    this._cargaArchivo.cargar_imagen_firebase(archivo).then(
      ()=>{
        this.cerrar_modal()
      }  
    )


  }

  


}
