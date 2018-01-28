import Controller from '@ember/controller';
import Object from '@ember/object';
import {getCompaniesJSON} from './companies'

function totalVotes(company) {
  return company.get('upvotes') + company.get('downvotes');
}

function calcPercent(company) {
    return (company.upvotes * 100 / (company.upvotes + company.downvotes)).toFixed(2);
}

function percentComparator(a, b) {
    return calcPercent(b) - calcPercent(a);
}

function randomize(comp) {
  let companies = JSON.parse(JSON.stringify(comp));
  companies[Math.floor(Math.random() * companies.length)].upvotes++;
  companies[Math.floor(Math.random() * companies.length)].downvotes++;
  return companies;
}

function votesSum(companies) {
  let votes = 0;
  for (let i = 0; i < companies.length; i++) {
    votes += companies[i].upvotes;
    votes += companies[i].downvotes;
  }
  return votes
}

var Company = Object.extend({
  score: function() {
    return (this.get('upvotes') * 100 / totalVotes(this)).toFixed(2);
  }.property('upvotes', 'downvotes')
});

export default Controller.extend({
  init: function () {
    this._super();
    this.set('companies', getCompaniesJSON());
    setInterval(() => {
      this.set('companies', randomize(this.get('companies')).map(function(json) {
        return Company.create(json);
      }));
    }, 100);
  },
  topCompanies: function() {
    return this.get('companies')
      .sort(percentComparator)
      .slice(0, 8);
  }.property('companies.@each.upvotes', 'companies.@each.downvotes'),
  votesSum: function() {
    return Math.floor(votesSum(this.get('companies'))/10) * 10;
  }.property('companies')
});
