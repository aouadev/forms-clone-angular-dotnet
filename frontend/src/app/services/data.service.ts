import { D } from "@angular/cdk/keycodes";
import { Injectable } from "@angular/core";
import { da } from "date-fns/locale";

@Injectable({
    providedIn:'root'
})
export class DataService {
    private data: any;

    setData(data: any) {
        this.data = data;
    }

    getData() {
        return this.data;
    }

    clearData() {
        this.data = null;
    }
}