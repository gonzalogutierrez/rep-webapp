// Developed by Houlak
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import * as atob from 'atob';
import { environment } from "environments/environment";

export class S3ManagerService {

  s3: S3;

  constructor() {
    AWS.config.region = environment.AWS.region; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: environment.AWS.credentials.IdentityPoolId
    });
    this.s3 = new S3({ params: { Bucket: environment.AWS.bucket } });
  }

  uploadFile(fileDataUri, key, callback) {

    let file = this._dataURItoBlob(fileDataUri);
    console.log(file);
    if (file) {
      let params = {
        Bucket: environment.AWS.bucket,
        Key: key,
        Body: file,
        ContentType: file.type,
        ServerSideEncryption: 'AES256'
      };

      this.s3.putObject(params, (err, data) => {
        if (err) {
          console.log(err.message, err.code);
          callback(false);
          return false;
        } else {
          // Upload Successfully Finished
          console.log('subido' + key);
          callback(true);
          return true;
        }
      })
    }
  }

  private _dataURItoBlob(dataURI) {
    let byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    let ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    let blob = new Blob([ia], {type: mimeString});
    let file = this._blobToFile(blob, 'img.jpg');
    return file;
  }

  private _blobToFile(theBlob, fileName){
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  }

  encode(data) {
    var str = data.reduce(function (a, b) { return a + String.fromCharCode(b) }, '');
    return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
  }

  downloadFile(key): Promise<string> {
    console.log(key);
    return new Promise((resolve, reject) => {
      this.s3.getObject({ Bucket: environment.AWS.bucket, Key: key }, (err, data) => {
        if (err) {
          console.log(err)
          return reject(err)
        }
        resolve("data:image/jpeg;base64," + this.encode(data.Body))
      })
    })
  }
}
