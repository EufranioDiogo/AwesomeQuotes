let limit = 50;

function generatorRandomInt(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}

function getAllGenres() {
    app.quoteGenres = ['random']

    fetch('https://quote-garden.herokuapp.com/api/v3/genres').then(response => response.json()).then((data) => {
        app.quoteGenres.push(...data.data);
    })
}

function quoteGenerator(genre = 'random') {
    if (genre === 'random') {
        fetch(' https://quote-garden.herokuapp.com/api/v3/quotes/random').then((response) => response.json()).then((data) => {
            data = data.data[0];
            app.quoteText = data.quoteText;
            document.querySelector('.quote-text').style.opacity = '1'
            app.quoteAuthor = data.quoteAuthor;
            app.quoteGenre = data.quoteGenre;
        })
    } else {
        fetch('https://quote-garden.herokuapp.com/api/v3/quotes?genre=' + encodeURI(genre)).then(response => response.json()).then(data => {
            let results = data.data;
            let index = null;

            if (!results.length) {
                index = generatorRandomInt(0, results.length);

                app.quoteText = results[index].quoteText;
                document.querySelector('.quote-text').style.opacity = '1';
                app.quoteAuthor = results[index].quoteAuthor;
                app.quoteGenre = results[index].quoteGenre;
            } else {
                index = generatorRandomInt(0, results.length);

                app.quoteText = results[index].quoteText;
                document.querySelector('.quote-text').style.opacity = '1'
                app.quoteAuthor = results[index].quoteAuthor;
                app.quoteGenre = results[index].quoteGenre;
            }
        })
    }
}


Vue.component('search-engine', {
    props: {
        searchresults: {
            type: Array,
            required: true
        },
    },
    template: `
    <div class="search-conteiner">
        <div class="search-input-conteiner">
            <input type="text" placeholder="Search to your favorite author" id="author-input-field" v-model="authorToSearch" @input.trim="newSearch();searchAuthors()" @keyup.enter="searchAuthors">
            <i v-if="showResults" class="fas fa-times" @click="closeResults"></i>
            <i v-else class="fas fa-search" @click="searchAuthors"></i>
        </div>

        <ul v-if="searchresults.length && showResults" class="search-results">
            <li v-for="author in searchresults" @click="knowMoreAboutAuthor(author)"> {{ author }} </li>
        </ul>
        <p class="result-not-found" v-else-if="searchresults.length == 0 && showResults == true">Sorry we can't find your author :(</p>
    </div>
    `,
    data() {
        return {
            prevAuthorName: '',
            authorToSearch: '',
            closesearchresult: false,
            showResults: false,
        }
    },
    methods: {
        searchAuthors() {
            this.authorToSearch = this.authorToSearch;

            if (this.authorToSearch !== '' && this.prevAuthorName !== this.authorToSearch && (this.prevAuthorName == '' || this.prevAuthorAuthor != '')) {
                this.$emit('search-authors', this.authorToSearch);
                this.prevAuthorName = this.authorToSearch;
                this.showResults = true;
            } else {
                if (this.authorToSearch == this.prevAuthorName) {
                    this.showResults = true;
                    document.querySelector('.main-conteiner').style.opacity = '0';
                } else {
                    this.showResults = false;
                }
            }

        },
        knowMoreAboutAuthor(authorName) {
            this.$emit('more-about-author', authorName);
        },
        closeResults() {
            this.showResults = false;
            document.querySelector('.main-conteiner').style.opacity = '1';
        },
        newSearch() {
            this.showResults = false;
            document.querySelector('.main-conteiner').style.opacity = '1';
        }
    }
})



let app = new Vue({
    el: '#app',
    data: {
        quoteText: '',
        quoteAuthor: '',
        quoteGenre: 'random',
        quoteGenres: [],
        searchResults: [],
        closeSearchResult: false,
    },
    methods: {
        generateQuote() {
            let value = document.querySelector('#genre').value;

            document.querySelector('.quote-text').style.opacity = '0';
            quoteGenerator(value);
        },
        searchAuthors(authorName) {
            app.searchResults = [];
            let data = [''];
            document.querySelector('.main-conteiner').style.opacity = '0';

            if (authorName) {
                while (data.length) {
                    data = [];

                    fetch(`https://quote-garden.herokuapp.com/api/v3/quotes?author=${authorName}`).then(response => response.json()).then(result => {
                        data = result.data;

                        for (let i = 0; i < data.length; i++) {
                            app.searchResults.push(data[i].quoteAuthor);
                        }
                    });
                }
                if (app.searchResults.length) {
                    document.querySelector('.main-conteiner').display = 'none';
                    app.closeSearchResult = true;
                }
            }
        },
        knowMoreAboutAuthor(authorName) {
            window.location.assign('HTML/author-quotes.html?author=' + encodeURI(authorName));
        }
    }
})

document.querySelector('.quote-information').addEventListener('click', () => {
    window.location.assign('HTML/author-quotes.html?author=' + encodeURI(app.quoteAuthor));
})

quoteGenerator();
getAllGenres();