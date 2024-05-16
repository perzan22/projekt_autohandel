import { Injectable } from "@angular/core";
import { Car } from "./car.model";
import { HttpClient } from "@angular/common/http";
import { Subject, map } from "rxjs";

@Injectable({ providedIn: 'root' })
export class CarService {

    private cars: Car[] = []
    private carsSubs = new Subject<{ cars: Car[] }>

    constructor(private http: HttpClient) {}

    getCarUpdateListener() {
        return this.carsSubs.asObservable()
    }

    getCars() {
        
        this.http.get<{ message: string, cars: any }>('http://localhost:3000/api/cars')
        .pipe(map(carData => {
            return {
                cars: carData.cars.map((car: { marka: string, model: string }) => {
                    return {
                       marka: car.marka,
                       model: car.model
                    }
                })
            }
        }))
        .subscribe({
            next: (fetchedCars) => {
                this.cars = fetchedCars.cars;
                this.carsSubs.next({ cars: [...this.cars] });
            }
        })
    }

}