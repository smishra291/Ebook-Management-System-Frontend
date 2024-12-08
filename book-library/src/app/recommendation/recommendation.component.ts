import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.css']
})
export class RecommendationComponent implements OnInit {
  @Input() userId!: number; // User ID passed from the parent component
  recommendations: any[] = [];
  errorMessage: string | null = null;

  private apiUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchRecommendations();
  }

  fetchRecommendations(): void {
    if (!this.userId) {
      this.errorMessage = 'User ID is required for recommendations.';
      return;
    }

    this.http.get<{ recommendations: any[] }>(`${this.apiUrl}/recommendations/${this.userId}`).subscribe(
      (response) => {
        this.recommendations = response.recommendations;
        this.errorMessage = null;
      },
      (error) => {
        console.error('Error fetching recommendations:', error);
        this.errorMessage = 'Failed to load recommendations.';
      }
    );
  }
}