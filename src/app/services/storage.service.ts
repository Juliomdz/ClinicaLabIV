import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage:Storage) { }

  async SubirImagenes(dni:string, files:any, perfil:any)
  {
    const urls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = `img${i}_${dni}_${Date.now()}_${Math.random()*10}`;
  
      const imgRef = ref(this.storage, `${perfil}/${fileName}`);
      await uploadBytes(imgRef, file).then(() => {
        getDownloadURL(imgRef).then(url => {
          urls.push(url)
        })
      })
    }
  
    return urls;
  }
}
