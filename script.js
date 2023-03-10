//Debounce 參考: https://ithelp.ithome.com.tw/articles/10222749
// func: 要執行的 function
// delay: 延遲幾秒才執行 
function debounce(func, delay) {
  // timeout 初始值
  let timeout = null;
  return function() {
    let context = this;  // 指向 myDebounce 這個 input
    let args = arguments;  // KeyboardEvent
    clearTimeout(timeout)
    timeout = setTimeout(function() {
      func.apply(context, args)
    }, delay)
  }
}

const showSuggest = debounce(() => {
  const input = document.getElementById("userinput");
  if (input.value.length > 0) {
    const suggestions = document.getElementById("suggestions");
    suggestions.classList.remove("hidden");
    //set border radius
    input.classList.add("no_bottom_radiu");
  } else {
    suggestions.classList.add("hidden");
    //set border radius
    input.classList.remove("no_bottom_radiu");
  }
  callApi(input.value, "series");
  callApi(input.value, "movie");
}, 1000);


//API Key: bf9d768b (虧左) /bf75902a (新) 
async function callApi(filmTitle, filmType) {
  const res = await fetch(`https://www.omdbapi.com/?&apikey=bf75902a&s=${filmTitle.trim()}&type=${filmType}`);
  const film = await res.json();
  showList(film, filmTitle, filmType);
}


function showList(film, filmTitle, filmType) {
  if (film.Response == "True") {
    const moviesUl = document.getElementById("moviesUl");
    const showUl = document.getElementById("showUl");
    // RegExp(匹配) g = global, i = 不分大小寫
    let pattern = new RegExp(filmTitle.trim(), "gi");
    if (filmType == "movie") {
      moviesUl.innerHTML = "";
      for (let i = 0; i < 3; i++) {
        //highlight 粗體 
        let three = film.Search[i].Title.replace(pattern, match => `<b >${match}</b>`);
        //create li & a
        const movielist = document.createElement("li");
        movielist.innerHTML = `<a href="#">${three}</a>`
        //append 
        movielist.classList.add("movielist");
        moviesUl.append(movielist);
      }
    } else if (filmType == "series") {
      showUl.innerHTML = "";
      for (let i = 0; i < 3; i++) {
        //highlight 粗體
        let three = film.Search[i].Title.replace(pattern, match => `<b>${match}</b>`);
        //create li & a
        const serieslist = document.createElement("li");
        serieslist.innerHTML = `<a href="#">${three}</a>`
        //append 
        serieslist.classList.add("serieslist");
        showUl.append(serieslist);
      }
    }
  } else {
    moviesUl.innerHTML = `<p class="error">Cannot find result</p>`
    showUl.innerHTML = `<p class="error">Cannot find result</p>`
  }
}










//note:
//http://www.omdbapi.com/?apikey=[yourkey]& <- & 後面加 Parameters
//Parameters: 
//s = Movie title to search for.
//type: Type of result to return.

//https://www.omdbapi.com/?&apikey=bf75902a&s=God (淨係出10個,得一個係series)
//因為如果api唔加type會出唔哂series/movie,咁就show唔到3個
//https://www.omdbapi.com/?&apikey=bf75902a&s=God&type=series (淨係 10 series)
//https://www.omdbapi.com/?&apikey=bf75902a&s=God&type=movie (淨係 10 movie)