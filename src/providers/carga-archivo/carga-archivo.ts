import { Injectable } from '@angular/core';
import { AngularFireDatabase} from 'angularfire2/database';
import * as firebase from 'firebase';
import 'rxjs/add/operator/map';
import { ToastController } from 'ionic-angular';

import { LoadingController } from 'ionic-angular';

/*
  Generated class for the CargaArchivoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CargaArchivoProvider {

  imagenes:ArchivoSubir[] = [];
  lastkey: string = null;

  constructor(public toastCtrl: ToastController, public afDB:AngularFireDatabase, public loadingCtrl: LoadingController) {
    console.log('Hello CargaArchivoProvider Provider');
    this.cargar_ultimo_key().subscribe(
      () =>{
          this.cargar_imagenes();
      }
    );
  }

  cargar_ultimo_key(){
    return this.afDB.list('/post', ref => ref.orderByKey()).valueChanges()
    .map((post:any) =>{
      console.log(post);
      this.lastkey = post[post.length -1].key;
      console.log(this.lastkey);
      
      this.imagenes = [];
      this.imagenes.push( post[post.length -1]);
    })
  }


  cargar_imagenes(){
    return new Promise((resolve,reject)=>{
      this.afDB.list('/post',ref => ref.limitToLast(3).orderByKey().endAt(this.lastkey)).valueChanges().subscribe((posts:any)=>
      {
        posts.pop();
        console.log(posts);
        if(posts.length == 0){
          console.log("Ya no hay mas registros")
          resolve(false);
          //return;
        }else{
          this.lastkey = posts[length].key;
          //this.imagenes = [];
          console.log("apenas va entrar al ciclo")
          for(let i = posts.length-1;     i>=0;      i--){
            let post = posts[i];
            this.imagenes.push(post);
          } 
          resolve(true);    
        }
       
      
      })

    });
  }

  cargar_imagen_firebase(archivo:ArchivoSubir){

    const loading = this.loadingCtrl.create({
      content: 'Subiendo Imagen...'
    });
  
   

    let promise = new Promise((resolve, reject)=>{
      //this.mostrar_toast('Cargando...');
      loading.present();

      let storeRef = firebase.storage().ref();
      let nombreArchivo:string= new Date().valueOf().toString();
      let uploadTask: firebase.storage.UploadTask = 
        storeRef.child(`img/${nombreArchivo}`).putString(archivo.img,'base64',{contentType:'image/jpeg'})
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      ()=>{},//Saber el % de cuantos Mbs se han subido
      (error)=>{
        //manejo de error
        loading.dismiss();
        console.log("ERROR EN LA CARGA");
        console.log(JSON.stringify(error));
        this.mostrar_toast(JSON.stringify(error));
      },
      
      ()=>{
        //TODO BIEN
        let urk = uploadTask.snapshot.downloadURL
        this.crear_post(archivo.titulo,urk,nombreArchivo)
         loading.dismiss();
        console.log("Archivo subido");
        this.mostrar_toast('Imagen subida correctamente');
        resolve();

      }
      )



    })

    return promise;

  }

  private crear_post(titulo:string, url:string,nombreArchivo:string){
    let post:ArchivoSubir ={
      img:url,
      titulo:titulo,
      key: nombreArchivo
    }

    console.log(JSON.stringify(post));
    //this.afDB.list('/post').push(post);
    this.lastkey = nombreArchivo;
    this.afDB.object(`/post/${nombreArchivo}`).update(post);
    
    //this.imagenes.push(post);

  }

  mostrar_toast(mensaje:string){
      this.toastCtrl.create({
        message: mensaje,
        duration: 2000
      }).present();
    }


}

interface ArchivoSubir{
  img:string;
  key?:string;
  titulo: string;
 
  
}
