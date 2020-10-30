import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpEvent 
} from '@angular/common/http';
import { Observable } from 'rxjs'
import { CustomHttpUrlEncodingCodec} from '../encoders';
import { JsonPipe } from '@angular/common';
@Injectable()
export class ComunasRestService {
    protected basePath = "https://midastest.minsal.cl/farmacias/maps/index.php/utilidades"
    public defaultHeaders = new HttpHeaders();

    constructor(protected httpClient: HttpClient) {
       
    }

    /**
     * @param consumes string[] mime-types
     * @return true:consumes 'multipart/form-data', false: otherwise
     */
    private canConsumeform(consumes: string[]): boolean {
        const form = 'multipart/form-data'
        for (const consume of consumes) {
            if ( form === consume) {
                return true;
            }
        }
        return false;
    }
    /**
     * @param idRegion reg_id
     * @param observe Observable
     * @param reportProgress flag para progreso,
     */
   public getComunasPorIdregionUsingPOST(idRegion?:number, observe: any = 'body',reportProgress: boolean = false):Observable<any> {

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if(idRegion !== undefined && idRegion !== null){
            queryParameters = queryParameters.set('reg_id',<any>idRegion);
        }
 
      const formData = new FormData();
      formData.append('reg_id',JSON.stringify(idRegion));

        return this.httpClient.post(`${this.basePath}/maps_obtener_comunas_por_regiones`,
       formData,{
           responseType: 'text'
       });
    }
}