const root = document.body;

class TotalVotes extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return this.totalVotes(this.props.companies) % 10 === 0;
    }

    totalVotes(companies) {
        let votes = 0;
        for (let i = 0; i < companies.length; i++) {
            votes += companies[i].upvotes;
            votes += companies[i].downvotes;
        }
        return votes
    }

    render() {
        return createElement('h3', {className: 'title'}, `Total number of votes: ` + this.totalVotes(this.props.companies))
    }
}

class App extends Component {
    constructor() {
        super();
        this.state = {
            companies: getCompaniesJSON()
        };

        function randomize(companies) {
            companies[Math.floor(Math.random() * companies.length)].upvotes++;
            companies[Math.floor(Math.random() * companies.length)].downvotes++;
            return companies;
        }

        setInterval(() => {
            this.setState({companies: randomize(this.state.companies)})
        }, 100);
    }

    render() {
        function calcPercent(company) {
            return (company.upvotes * 100 / (company.upvotes + company.downvotes));
        }

        function displayPercent(company) {
            return (company.upvotes * 100 / (company.upvotes + company.downvotes)).toFixed(2);
        }

        function renderRow(company) {
            return createElement('li', {className: 'item'}, company.title + " " + displayPercent(company) + '%');
        }

        function percentComparator(a, b) {
            return calcPercent(b) - calcPercent(a);
        }

        return createElement('div', {className: 'main'}, [
            createElement('ul',
                {className: 'list'},
                this.state.companies
                    .sort(percentComparator)
                    .slice(0, 8)
                    .map(renderRow)),
            createElement(TotalVotes, {companies: this.state.companies})
        ]);
    }

}

mount(createElement(App), root);