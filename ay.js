window.addEventListener("load", async () => {

    let baseUrl = "https://5bee92827839000013e6faed.mockapi.io/clane/api/v2";
    let listUl = document.getElementById('list-ul');
    let statusElem = document.getElementById('loading');
    let app = document.getElementById('y-app');

    let prev = document.getElementById('prev');
    let next = document.getElementById('next');
    let pageNoDisplay = document.getElementById('page-no-display');
    let pageNo = 1;
    let listLimit = 10;

    getTheNews(baseUrl, pageNo, listLimit)

    next.addEventListener('click', function (e) {
        e.preventDefault();
        doNav(pageNo++);
    }, false);
    prev.addEventListener('click', function (e) {
        e.preventDefault();
        doNav(pageNo--);
    }, false);

    // console.log('....');
    // fetch(`${baseUrl}/news`)
    //     .then(function (response) {
    //         return response.json();
    //     })
    //     .then(function (myJson) {
    //         console.log(JSON.stringify(myJson, null, 4));
    //     });



    async function getTheNews(baseUrl, pageNo, listLimit) {
        let news = await getAllNews(`${baseUrl}/news?page=${pageNo}&limit=${listLimit}`);
        console.log(JSON.stringify(news, null, 4));

        news.forEach(item => {
            let li = document.createElement('li');
            let html = `
                <a href="news-detail.html?id=${item.id}" class="y-list-item-link">
                    <div>
                        <h4>${item.title}</h4>
                        <p>by ${item.author}</p>
                    </div>
                </a>
            `
            li.innerHTML = html;
            listUl.appendChild(li);
        });
        pageNoDisplay.innerHTML = pageNo;

    }

    async function getAllNews(url) {
        let loadingTag = loading(statusElem);
        let newsRaw = await fetch(url);

        let news = newsRaw.json();

        stopLoading(loadingTag)
        return news;
    }

    function loading(elem) {
        let div = document.createElement('div');
        div.classList.add('y-loading')
        div.innerHTML = '... loading news';
        div.classList.add('y-show')
        app.appendChild(div);
        return div;
    }

    function stopLoading(elem) {
        elem.classList.remove('y-show')
    }

    function doNav(indx) {

        listUl.innerHTML = '';
        getTheNews(baseUrl, pageNo, listLimit)


    }

});





// window.onload = function () {
//     init();
//     doSomethingElse();
// };




