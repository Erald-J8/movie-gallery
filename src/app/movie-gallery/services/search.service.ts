import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import {
    BehaviorSubject,
    catchError,
    finalize,
    map,
    Observable,
} from 'rxjs'
import { environment } from '../../../environments/environment'

@Injectable({
    providedIn: 'root',
})
export class SearchService {
    public isLoading = new BehaviorSubject<boolean>(false)

    constructor(private http: HttpClient) {}

    searchMovies(searchTerm: string): Observable<any> {
        const options = this.createHttpOptions(searchTerm)
        return this.http.get(environment.config.url, options).pipe(
            map((result: any) => {
                return result.Search
            }),
            catchError((error) => {
                this.isLoading.next(false)
                return error.Error
            })
        );
    }

    private createHttpOptions(movieName: string) {
        const params = new HttpParams({
            fromObject: { s: movieName, apikey: environment.config.omdbApiKey },
        })
        return { params }
    }
}
