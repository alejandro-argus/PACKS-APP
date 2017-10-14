import { Injectable } from '@angular/core';
import { AngularFireDatabase} from 'angularfire2/database';
import * as firebase from 'firebase';
import { ToastController } from 'ionic-angular';

/*
  Generated class for the CargaArchivoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CargaArchivoProvider {

  constructor(public toastCtrl: ToastController) {
    console.log('Hello CargaArchivoProvider Provider');
  }

  cargar_imagen_firebase(archivo:ArchivoSubir){
    let promise = new Promise((resolve, reject)=>{
      this.mostrar_toast('Cargando...');

      let storeRef = firebase.storage().ref();
      let nombreArchivo:string= new Date().valueOf().toString();
      let uploadTask: firebase.storage.UploadTask = 
        storeRef.child(`img/${nombreArchivo}`).putString(archivo.img,'base64',{contentType:'image/jpeg'})
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      ()=>{},//Saber el % de cuantos Mbs se han subido
      (error)=>{
        //manejo de error
        console.log("ERROR EN LA CARGA");
        console.log(JSON.stringify(error));
        this.mostrar_toast(JSON.stringify(error));
      },
      
      ()=>{
        //TODO BIEN
        console.log("Archivo subido");
        this.mostrar_toast('Imagen subida correctamente')
        resolve();

      }
      )



    })

    return promise;

  }

  mostrar_toast(mensaje:string){
      this.toastCtrl.create({
        message: mensaje,
        duration: 2000
      }).present();
    }


}

interface ArchivoSubir{
  titulo: string;
  img:string;
  key?:string;
}
