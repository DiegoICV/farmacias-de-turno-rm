import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpEvent 
} from '@angular/common/http';
import { Observable } from 'rxjs'
import { CustomHttpUrlEncodingCodec} from '../encoders';
import { JsonPipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Farmacia } from '../models/farmacias';
@Injectable()
export class FarmaciasRestService {
   basePath = environment.basePath;
    constructor(protected httpClient: HttpClient) {
       
    }

    
    /**
     * @param idRegion reg_id
     * @param observe Observable
     * @param reportProgress flag para progreso,
     */
    public getFarmaciasPorIdregionUsingGET(idRegion?:number, observe?: 'body', reportProgress?: boolean): Observable<Array<Farmacia>>;
    public getFarmaciasPorIdregionUsingGET(idRegion?:number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<Farmacia>>>;
    public getFarmaciasPorIdregionUsingGET(idRegion?:number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<Farmacia>>>;
    public getFarmaciasPorIdregionUsingGET(idRegion?:number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

    if (idRegion === null || idRegion === undefined) {
        throw new Error('Required parameter idregion was null or undefined when calling traerComunaPorIdV1UsingGET.');
    }
    return this.httpClient.get(`${this.basePath}/traer-farmacias-por-id-region/${idRegion}`);
}
    public getFarmaciasDeTurnoPorNombreComunaUsingGET(comuna?:string, observe?: 'body', reportProgress?: boolean): Observable<Array<Farmacia>>;
    public getFarmaciasDeTurnoPorNombreComunaUsingGET(comuna?:string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<Farmacia>>>;
    public getFarmaciasDeTurnoPorNombreComunaUsingGET(comuna?:string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<Farmacia>>>;
    public getFarmaciasDeTurnoPorNombreComunaUsingGET(comuna?:string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

    if (comuna === null || comuna === undefined) {
        throw new Error('Required parameter \'comuna\' was null or undefined when calling traerComunaPorIdV1UsingGET.');
    }
    return this.httpClient.get(`${this.basePath}/traer-farmacias-de-turno?comuna=${comuna}`);
}

public getFarmaciasDeTurnoPorIdComunaUsingGET(idComuna?:string, observe?: 'body', reportProgress?: boolean): Observable<Array<Farmacia>>;
    public getFarmaciasDeTurnoPorIdComunaUsingGET(idComuna?:string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<Farmacia>>>;
    public getFarmaciasDeTurnoPorIdComunaUsingGET(idComuna?:string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<Farmacia>>>;
    public getFarmaciasDeTurnoPorIdComunaUsingGET(idComuna?:string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

    if (idComuna === null || idComuna === undefined) {
        throw new Error('Required parameter \'comuna\' was null or undefined when calling traerComunaPorIdV1UsingGET.');
    }
    return this.httpClient.get(`${this.basePath}/traer-farmacias-de-turno-por-comuna-id/${idComuna}`);
}
}