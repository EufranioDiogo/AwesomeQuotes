let authorName = window.location.href.split('?')[1].split('=')[1]


function getDataAboutAuthor() {
  fetch(`https://quote-garden.herokuapp.com/api/v2/authors/${authorName}`).then((response) => response.json()).then((data) => {
    app.maxPage = data.totalPages;
    app.array = data.quotes;
  })
}


let app = new Vue({
  el: '.main-conteiner',
  data: {
    authorName: '',
    actualPage: 1,
    maxPage: 0,
    array: [],
  },
  methods: {
    nextQuotes() {
      if (app.array.length) {
        app.actualPage += 1;
        app.getQuotes()
      }
    },
    prevQuotes() {
      if (app.actualPage > 1) {
        app.actualPage -= 1;
        app.getQuotes()
      }
    },
    getQuotes() {
      if(app.array.length){
        document.querySelector('.quote-list').style.opacity = '0'
      } else {
        document.querySelector('.no-more-quotes').style.opacity = '0'
      }
      fetch(`https://quote-garden.herokuapp.com/api/v2/authors/${authorName}?page=${app.actualPage}`).then((response) => response.json()).then((data) => {
        app.array = data.quotes;
        document.querySelector('.quote-list').style.opacity = '1'
      })
    }
  },
})
//76-28-GJ

app.authorName = decodeURI(authorName)
getDataAboutAuthor()

document.querySelector('.go-back').onclick = () => {
  window.history.back()
}

/*
{
  statusCode : int,
  message : String,
  totalPages : int,
  currentPage : int,
  quotes : array
}
*/
