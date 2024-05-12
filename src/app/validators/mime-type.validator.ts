import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

 export const mimeType = (control: AbstractControl): Promise<{ [key: string]: any} > | Observable<{ [key: string]: any }> => {
    const file = control.value as File;
    const fileReader = new FileReader();
    const frObs = new Observable((observer: Observer<{ [key: string]: any }> ) => {
        fileReader.onload = () => {
            const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
            let header = '';
            let isValid = false;
            for (let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16);
            }
            const validHeaders = [
              '89504e47',  // PNG
              'ffd8ffe0',  // JPG
              'ffd8ffe1',  // JPG
              'ffd8ffe2',  // JPG
              'ffd8ffe3',  // JPG
              'ffd8ffe8',  // JPG
            ];
            isValid = validHeaders.some(validHeader => header.startsWith(validHeader));      
            if (isValid) {
              observer.next(null!);
            } else {
              observer.next({ invalidMimeType: true });
            }
            observer.complete();
            };
        fileReader.readAsArrayBuffer(file);
    });
    return frObs;
 }