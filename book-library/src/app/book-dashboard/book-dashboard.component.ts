import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-dashboard',
  templateUrl: './book-dashboard.component.html',
  styleUrls: ['./book-dashboard.component.css']
})
export class BookDashboardComponent implements OnInit {
  inventory: any[] = [];
  borrowedBooks: any[] = [];
  selectedBookId: number | null = null;
  dueDate: string | null = null;
  userId: number | null = null;
  errorMessage: string | null = null;
   visibleReviews: { [key: number]: boolean } = {}; // Tracks visible reviews by book_id

  private apiUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    console.log(localStorage)
    const userData = localStorage.getItem('user');

    if (userData) {
      const user = JSON.parse(userData);
      console.log(user)
      this.userId = user.user_id;
      console.log('Logged in user ID:', this.userId);
    } else {
      alert('No user is logged in. Redirecting to login...');
      this.router.navigate(['/login']);
    }

    this.loadInventory();
    this.loadBorrowedBooks();
  }

  loadInventory(): void {
    this.http.get<{ inventory: any[] }>(`${this.apiUrl}/inventory`).subscribe(
      (response) => {
        this.inventory = response.inventory;
        this.errorMessage = null;
      },
      (error) => {
        console.error('Error loading inventory:', error);
        this.errorMessage = 'Failed to load inventory.';
      }
    );
  }

  loadBorrowedBooks(): void {
    if (!this.userId) return;

    this.http.get<{ borrowed_books: any[] }>(`${this.apiUrl}/borrowed/${this.userId}`).subscribe(
      (response) => {
        this.borrowedBooks = response.borrowed_books;
        this.errorMessage = null;
      },
      (error) => {
        console.error('Error loading borrowed books:', error);
        this.errorMessage = 'Failed to load borrowed books.';
      }
    );
  }

  viewReviews(bookId: number): void {
    this.selectedBookId = bookId;
    const reviewsSection = document.getElementById('reviews');
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  borrowBook(): void {
    if (!this.selectedBookId || !this.dueDate) {
      alert('Error: Book and Due Date are required');
      return;
    }
    console.log('Selected Book ID:', this.selectedBookId); 

    this.http.post(`${this.apiUrl}/borrow`, {
      user_id: this.userId,
      book_id: this.selectedBookId,
      due_date: this.dueDate
    }).subscribe(
      () => {
        alert('Book borrowed successfully!');
        this.loadInventory();
        this.loadBorrowedBooks();
      },
      (error) => {
        console.error('Error borrowing book:', error);
        alert(`Error: ${error.error.error || 'Could not borrow book'}`);
      }
    );
  }

  returnBook(bookId: number): void {
    if (!bookId) {
      alert('Error: Book ID is required to return the book');
      return;
    }

    this.http.post(`${this.apiUrl}/return`, {
      user_id: this.userId,
      book_id: bookId
    }).subscribe(
      () => {
        alert('Book returned successfully!');
        this.loadInventory();
        this.loadBorrowedBooks();
      },
      (error) => {
        console.error('Error returning book:', error);
        alert(`Error: ${error.error.error || 'Could not return book'}`);
      }
    );
  }

  
  // Logout
  logout(): void {
    localStorage.removeItem('user');
    alert('Logged out successfully!');
    this.router.navigate(['/login']);
  }
}