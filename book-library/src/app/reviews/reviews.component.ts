import { Component, Input, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnChanges {
  @Input() bookId!: number; // Book ID passed from parent component
  reviews: any[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null; // Success message for submitting reviews
  newReviewText: string = ''; // Text for the new review
  newReviewRating: number = 5; // Default rating for the new review

  private apiUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {}

  ngOnChanges(): void {
    if (this.bookId) {
      this.fetchReviews();
    }
  }

  fetchReviews(): void {
    this.http.get<{ reviews: any[] }>(`${this.apiUrl}/reviews/${this.bookId}`).subscribe(
      (response) => {
        console.log('Fetched Reviews:', response.reviews);
        this.reviews = response.reviews;
        this.errorMessage = null;
      },
      (error) => {
        console.error('Error fetching reviews:', error);
        this.errorMessage = 'Failed to load reviews.';
      }
    );
  }

  submitReview(): void {
    if (!this.bookId) {
      this.errorMessage = 'No book selected to review.';
      return;
    }

    // Replace this with the actual user ID from your authentication system
    const userId = JSON.parse(localStorage.getItem('user') || '{}').user_id;

    if (!userId) {
      this.errorMessage = 'User not logged in.';
      return;
    }

    const reviewData = {
      book_id: this.bookId,
      user_id: userId,
      rating: this.newReviewRating,
      review_text: this.newReviewText
    };

    this.http.post(`${this.apiUrl}/reviews`, reviewData).subscribe(
      () => {
        this.successMessage = 'Review added successfully!';
        this.newReviewText = '';
        this.newReviewRating = 5;
        this.fetchReviews(); // Reload reviews after submission
        this.errorMessage = null;
      },
      (error) => {
        console.error('Error submitting review:', error);
        this.errorMessage = 'Failed to add review.';
        this.successMessage = null;
      }
    );
  }
}