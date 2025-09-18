let articles_container = document.getElementById("articles-container");
let search_input = document.getElementById("search-input");
let loader = document.getElementById("loader");
let category_buttons = document.querySelectorAll(".category-button");
let indian_news_container = document.getElementById("indian-news-container");

// ------------------------------------------------------------------------------------------------

const key = "61da66450c8e42fdbf543e90f2d33c1a";
const url = `https://newsapi.org/v2/top-headlines?language=en&pageSize=50&apiKey=${key}`;
let articles_collection = [];

// ------------------------------------------------------------------------------------------------

window.addEventListener("load", () => {

    start_loading();

    setTimeout(() => {

        load_news();

        indian_news();

    }, 1000);

});

// ------------------------------------------------------------------------------------------------

function start_loading() {

    articles_container.innerHTML = "";

    loader.style.display = "inline-block";

};

function stop_loading() {

    loader.style.display = "none";

};

// ------------------------------------------------------------------------------------------------

const load_news = async () => {

    try {

        let promise = await fetch(url);

        let data = await promise.json();

        articles_collection = data.articles;

        load_articles(articles_collection);

    }
    catch (error) {

        articles_container.textContent = "Failed To Load News! Please Try Again Later!";

    }
    finally {

        stop_loading();

    }

};

// ------------------------------------------------------------------------------------------------

function load_articles(articles) {

    articles.forEach((article) => {

        let article_element = document.createElement('article');

        let title = document.createElement('h3');

        let link = document.createElement("a");
        link.textContent = article.title || "No Title Available!";
        link.href = article.url || "#";
        link.target = "_blank";
        title.appendChild(link);

        let hr = document.createElement('hr');

        let description = document.createElement('p');
        description.textContent = article.description || "No Description Available!";

        article_element.appendChild(title);
        article_element.appendChild(hr);
        article_element.appendChild(description);

        articles_container.appendChild(article_element);

    });

};

// ------------------------------------------------------------------------------------------------

function debounce(search_function, delay) {

    let time_out;

    return function (...arguments) {

        clearTimeout(time_out);

        time_out = setTimeout(() => {

            search_function.apply(this, arguments);

        }, delay);

    };

};

// ------------------------------------------------------------------------------------------------

let debounced_search_news = debounce(search_news, 1000);

let debounce_categoriize_news = debounce(categorize_news, 1000);

// ------------------------------------------------------------------------------------------------

search_input.addEventListener("input", () => {

    start_loading();

    debounced_search_news();

});

// ------------------------------------------------------------------------------------------------

async function search_news() {

    let search_query = search_input.value.toLowerCase();

    if (search_query != "") {

        try {

            let search_url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(search_query)}&language=en&pageSize=50&apiKey=${key}`;

            let promise = await fetch(search_url);

            let data = await promise.json();

            if (data.articles.length == 0) {

                articles_container.textContent = "No Articles Found!";

            }
            else {

                load_articles(data.articles);

            }

        }
        catch (error) {

            articles_container.textContent = "Failed To Search News! Please Try Again Later!";

        }

    }
    else {

        load_articles(articles_collection);

    }

    stop_loading();

};

// ------------------------------------------------------------------------------------------------

category_buttons.forEach((button) => {

    button.addEventListener("click", () => {

        let selected_category = button.getAttribute("data-category");

        start_loading();

        debounce_categoriize_news(selected_category);

        highlight_active_category(button);

    });

});

// ------------------------------------------------------------------------------------------------

async function categorize_news(category) {

    if (category === "all") {

        load_articles(articles_collection);

    }
    else {

        try {

            let category_url = `https://newsapi.org/v2/top-headlines?country=us&pageSize=50&category=${category}&apiKey=${key}`;

            let promise = await fetch(category_url);

            let data = await promise.json();

            if (data.articles.length == 0) {

                articles_container.textContent = "No Articles Found In This Category!";

            }
            else {

                load_articles(data.articles);

            }

        }
        catch (error) {

            articles_container.textContent = "Failed To Categorize News! Please Try Again Later!";

        }

    }

    stop_loading();

};

// ------------------------------------------------------------------------------------------------

function highlight_active_category(active_button) {

    category_buttons.forEach((btn) => {

        btn.classList.remove("active-category");

    });

    active_button.classList.add("active-category");

};

// ------------------------------------------------------------------------------------------------

async function indian_news() {

    try {

        let indian_url = `https://newsapi.org/v2/everything?q=india&language=en&pageSize=10&apiKey=${key}`;

        let promise = await fetch(indian_url);

        let data = await promise.json();

        if (data.articles.length == 0) {

            indian_news_container.textContent = "No Articles Found!";

        }
        else {

            let sorted_articles = data.articles.sort((a, b) => {

                let date_a = new Date(a.publishedAt);

                let date_b = new Date(b.publishedAt);

                return date_b - date_a;

            });

            load_indian_news(sorted_articles);

        }

    }
    catch (error) {

        indian_news_container.textContent = "Failed To Find Indian News! Please Try Again Later!"

    }

};

// ------------------------------------------------------------------------------------------------

function load_indian_news(articles) {

    articles.forEach((article) => {

        let article_element = document.createElement('article');

        let title = document.createElement('h3');

        let link = document.createElement("a");
        link.textContent = article.title || "No Title Available!";
        link.href = article.url || "#";
        link.target = "_blank";
        title.appendChild(link);

        let hr = document.createElement('hr');

        let description = document.createElement('p');
        description.textContent = article.description || "No Description Available!";

        article_element.appendChild(title);
        article_element.appendChild(hr);
        article_element.appendChild(description);

        indian_news_container.appendChild(article_element);

    });

};