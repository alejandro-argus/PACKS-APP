import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,public alertCtrl: AlertController) {

  }

  doAlert() {
    let alert = this.alertCtrl.create({
      title: 'Que onda',
      subTitle: 'opinshi ramiro',
      buttons: ['OK']
    });
    alert.present();
  }
}

