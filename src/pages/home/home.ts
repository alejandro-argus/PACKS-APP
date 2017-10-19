import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { SubirPage } from '../subir/subir';
import {CargaArchivoProvider} from '../../providers/carga-archivo/carga-archivo'


//import { AngularFireDatabase } from 'angularfire2/database';
//import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //posts: Observable<any[]> = null;
  haymas:boolean = true;

  constructor(private modalCtrl:ModalController, 
              private _cap:CargaArchivoProvider
              ) {}

  mostrar_modal(){
    let modal = this.modalCtrl.create(SubirPage)
    modal.present();
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

      this._cap.cargar_imagenes().then(
        (hayMas:boolean) =>{
          this.haymas = hayMas;
          infiniteScroll.complete();
        }
      )
    

  }


}

