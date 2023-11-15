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
  allMovies: any[] = [];
  moviesToDisplay: any[] = [];
  errorMessage = ''
  searchValue = ''
  isLoading = false
  searchState$ = new BehaviorSubject('')

  displayedColumns: string[] = ['id', 'title', 'type', 'year'];

  private ngUnsubscribe = new Subject<void>();

  constructor(public searchService: SearchService, private dialog: MatDialog) {}

  ngOnInit(): void {
      this.searchService.isLoading.pipe(
          takeUntil(this.ngUnsubscribe),
          debounceTime(1000),
        ).subscribe((value) => {
          this.moviesToDisplay = []
          this.errorMessage = ''

          // when movies are finished loading take only the first 3 which have the highest rating (could use another criteria...)
          if (this.allMovies.length) {
              this.moviesToDisplay = this.allMovies.sort((first: any, second: any): number => {
                  return (Number.parseInt(first.imdbVotes) < Number.parseInt(second.imdbVotes)) as unknown as number
              })
              if (this.allMovies.length > 3)
                this.moviesToDisplay = this.allMovies.slice(0, 3)
          } else if (this.searchValue.length) {
              this.errorMessage = 'No movies found! Try searching for another title...'
          }
          
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
      this.allMovies = []
      this.moviesToDisplay = []
      this.errorMessage = ''

      if (keyword && keyword.length) {
            this.searchService
                .searchMovies(keyword)
                .pipe(
                    takeUntil(this.ngUnsubscribe),
                    finalize(() => this.searchService.isLoading.next(false))
                )
                .subscribe((movies) => {
                    this.allMovies = this.allMovies.concat(movies).filter((movie) => movie && movie.Title)
                })
      }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }
}
