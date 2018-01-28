import {Component} from '@angular/core';

import {Companies} from './companies';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  state: {
    companies: { upvotes: number, downvotes: number }[];
    votes: number;
  };
  companies: Array<string>;
  votes: number;

  constructor() {
    this.state = {
      companies: Companies.getCompaniesJSON(),
      votes: null
    };
    setInterval(() => {
      this.calculateState();
      this.renderCompanies();
      if (this.shouldComponentUpdate()) {
        this.renderVotes();
      }
    }, 100);
  }

  shouldComponentUpdate() {
    return AppComponent.totalVotes(this.state.companies) % 10 == 0;
  }

  calculateState() {
    this.state.companies = AppComponent.randomize(this.state.companies);
    this.state.votes = AppComponent.totalVotes(this.state.companies);
  }

  renderCompanies() {
    this.companies = this.state.companies
      .sort(AppComponent.percentComparator)
      .slice(0, 8)
      .map(AppComponent.renderRow);
  }

  renderVotes() {
    this.votes = this.state.votes;
  }

  static calcPercent(company): number {
    return (company.upvotes * 100 / (company.upvotes + company.downvotes));
  }

  static renderRow(company) {
    return company.title + " " + AppComponent.calcPercent(company).toFixed(2) + '%';
  }

  static percentComparator(a, b) {
    return AppComponent.calcPercent(b) - AppComponent.calcPercent(a);
  }

  static totalVotes(companies): number {
    let votes = 0;
    for (let i = 0; i < companies.length; i++) {
      votes += companies[i].upvotes;
      votes += companies[i].downvotes;
    }
    return votes
  }

  static randomize(companies) {
    companies[Math.floor(Math.random() * companies.length)].upvotes++;
    companies[Math.floor(Math.random() * companies.length)].downvotes++;
    return companies;
  }
}
