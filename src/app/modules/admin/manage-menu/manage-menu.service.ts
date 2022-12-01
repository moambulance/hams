import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})
export class ManageMenuService {
    baseUrl: any = environment.BASE_URL;

    constructor(private http: HttpClient) { }

    getAllMenuList() {
        return this.http.get(this.baseUrl + 'master/manage-menu/all');
    }
    
    getAllActiveMenuList() {
        return this.http.get(this.baseUrl + 'master/manage-menu/allActive');
    }
    
    getAllActiveMenuListByType(type: string) {
        return this.http.get(this.baseUrl + 'master/manage-menu/allActiveByType/'+type);
    }
    
    getMenuById(id: string) {
        return this.http.get(this.baseUrl + 'master/manage-menu/getById/'+ id);
    }

    saveMenu(data: any, id?: string, type?: string) {
        const url = (type === "Save") ? `master/manage-menu/update/${id}` : `master/manage-menu/save`;
        const requestType = (type === "Save") ? 'put' : 'post';
        return this.http[requestType](this.baseUrl + url, data);
    }
    
    updateMenu(data: any, id:string) {
        return this.http.put(this.baseUrl + 'master/manage-menu/update/'+id, data);
    }
    
    updateMenuStatus(data: any, id:string) {
        return this.http.put(this.baseUrl + 'master/manage-menu/updateStatus/'+id, data);
    }

    getAllSubMenuListByMenuId(id: string) {
        return this.http.get(this.baseUrl + 'master/sub-menu/all/'+ id);
    }

    updateSubMenuStatus(data: any, id:string) {
        return this.http.put(this.baseUrl + 'master/sub-menu/updateStatus/'+id, data);
    }

}