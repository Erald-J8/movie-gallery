import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, debounceTime, delay, distinctUntilChanged, finalize, Subject, takeUntil } from 'rxjs';
import { SearchService } from '../../services/search.service';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component'

@Component({
  selector: 'gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.sass'],
})
export class GalleryComponent implements OnInit, OnDestroy {
  moviesToDisplay: any[] = [];
  errorMessage = ''
  searchValue = ''
  isLoading = false
  searchState$ = new BehaviorSubject('')

  displayedColumns: string[] = ['id', 'title', 'type', 'year'];

  private ngUnsubscribe = new Subject<void>();

  constructor(public searchService: SearchService, private dialog: MatDialog) {}

  ngOnInit(): void {
      this.searchService.isLoading$.pipe(
          takeUntil(this.ngUnsubscribe),
        ).subscribe(() => {
            this.errorMessage = ''
            // when movies are finished loading take only the first 3 which have the highest rating (could use another criteria...)
            if (this.moviesToDisplay.length > 3) {
                this.moviesToDisplay = this.moviesToDisplay.slice(0, 3)
            } else if (!this.moviesToDisplay.length && this.searchValue.length) {
                this.errorMessage = 'No movies found! Try searching for another title...'
            }    
        }
      )

      this.searchState$.pipe(
          takeUntil(this.ngUnsubscribe),
          debounceTime(1000),

      ).subscribe(() => {
          this.onMovieSearched(this.searchValue)
      })
  }

  openMovieInfo(movie: any) {
      this.dialog.open(InfoDialogComponent, {
          data: {
              imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
              posterUrl: movie.Poster
          }
      })
  }

  onMovieSearched(keyword: string) {
      this.moviesToDisplay = []
      this.errorMessage = ''

      if (keyword && keyword.length) {
            this.searchService
                .searchMovies(keyword)
                .pipe(
                    takeUntil(this.ngUnsubscribe),
                    finalize(() => this.searchService.isLoading$.next(false))
                )
                .subscribe((movies) => {
                    this.moviesToDisplay = this.moviesToDisplay.concat(movies).filter((movie) => movie && movie.Title)
                })
      }
  }

  setValue(keyword: string) {
      this.searchValue = keyword
      this.searchState$.next(keyword)
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }
}
