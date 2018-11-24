window.addEventListener("load", async () => {

    let baseUrl = "https://5bee92827839000013e6faed.mockapi.io/clane/api/v2";
    let statusElem = document.getElementById('loading');
    let listUl = document.getElementById('list-ul');
    let listUlImgs = document.getElementById('list-ul-imgs');
    let imgsSection = document.querySelector('.y-images-section');
    let prevImgBtn = document.querySelector('.y-prev-img');
    let nextImgBtn = document.querySelector('.y-next-img');
    let app = document.getElementById('y-app');
    let postCommentBtn = document.getElementById('post-comment');
    let postEditCommentBtn = document.getElementById('post-edit-comment-btn')


    let winLocation = window.location.search;
    let docId = winLocation.split('?').pop().split('=').pop();
    console.log('win loc: ', docId)
    // let news = await getNewsById(docId);


    let imagesUrl = `${baseUrl}/news/${docId}/images`
    let commentsUrl = `${baseUrl}/news/${docId}/comments`
    let imgPostUrl = `${baseUrl}/news/${docId}/images`
    let commentPostUrl = `${baseUrl}/news/${docId}/comments`
    let editCommentUrl = `${baseUrl}/news/${docId}/comments/`

    let img2display = 0;
    let imgsArray = [];
    let theCommentId = 0;

    let allNewsData = await getAllNewsData();
    console.log('done getting all data ');


    //`/news/${docId}/images`
    async function getAllNewsData() {
        let news = await getNewsById(docId);
        console.log(JSON.stringify(news, null, 4));

        let images = await getNewsImages(imagesUrl);
        console.log('images: ', JSON.stringify(images, null, 4));
        imgsArray = images;
        displayImg(images);

        let comments = await getNewsComments(commentsUrl);
        console.log('comments: ', JSON.stringify(comments, null, 4));
        displayComments(comments);


    }
    postCommentBtn.addEventListener('click', async function (e) {
        e.preventDefault();
        console.log('in postcoment 1')
        let comment = document.getElementById('comment').value;
        let name = document.getElementById('name').value;
        let avatar = document.getElementById('avatar').value;
        console.log('tosend: ', { comment, name, avatar })
        let postedComment = await addComment({ comment, name, avatar }, docId, commentPostUrl)
        console.log('postedComment: ', postedComment)

    }, false)

    prevImgBtn.addEventListener('click', function (e) {
        e.preventDefault();
        img2display--;
        displayImg(imgsArray);
    })

    nextImgBtn.addEventListener('click', function (e) {
        e.preventDefault();
        img2display++;
        displayImg(imgsArray);
    })
    //post-edit-comment-btn
    listUl.addEventListener('click', async function (e) {
        let target = e.target;
        console.log('target: ', target.id);
        if (target.id === 'post-edit-comment-btn') {
            e.preventDefault();
            console.log('yeah it is the btn')
            let commentElem = document.querySelector('.y-edit-comment-form #comment');
            let comment = commentElem.value;

            console.log('commentId from dataset: ', theCommentId)
            let durl = `${editCommentUrl}/${theCommentId}`;
            let commentEditted = await editComment({ comment }, durl)
            console.log('editted comment...: ', commentEditted);
        }
        if (target.id === 'edit-comment') {
            console.log('it is the edit btn yo! ');
            let commentForm = document.querySelector('.y-edit-comment-form');
            commentForm.classList.remove('y-hide');


        }

        e.preventDefault();
        console.log('post-edit-comment ')
    })


    //https://i1.wp.com/thefreshimages.com/wp-content/uploads/2018/06/lord-shiva-images-39.jpg


    function displayComments(commentArray) {

        commentArray.forEach(item => {
            let li = document.createElement('li');
            theCommentId = item.id;
            let html = `
                
                    <div>
                        <h4>${item.comment}</h4>
                        <p>by ${item.name}</p>
                        <p>
                          <button class='edit-comment' id='edit-comment'> edit comment</button>
                          <button class='delete-comment' id='delete-comment'> delete </button>
                        </p>
                        
                        <form action="" method="post" class="y-edit-comment-form y-hide">
                        <div>
                            <textarea name="comment" id="comment" cols="30" rows="10" placeholder="your comment" data-commentid="${item.id}">
                            ${item.comment}/${item.id}
                            </textarea>
                            <input id="commentId" hidden="true" value=${item.id} />
                        </div>
        
                        <button id="post-edit-comment-btn">submit</button>
                    </form>
        
                    </div>
                
            `
            li.innerHTML = html;
            listUl.appendChild(li);
        });

    }

    function displayImgs(imgArray) {
        imgArray.forEach(item => {
            let li = document.createElement('li');
            let html = `
            <img src=${item.image} alt="news sliders" />    
            `
            li.innerHTML = html;
            listUlImgs.appendChild(li);
        });
    }

    function displayImg(imgArray) {
        let totalImgs = imgArray.length;
        console.log('img2display: ', img2display);
        let imgUrl = imgArray[img2display].image;
        console.log('imgUrl: ', imgUrl);
        imgsSection.innerHTML = `<img src=${imgUrl} alt="news sliders" />`

        // imgArray.forEach(item => {
        //     let li = document.createElement('li');
        //     let html = `
        //     <img src=${item.image} alt="news sliders" />    
        //     `
        //     li.innerHTML = html;
        //     listUlImgs.appendChild(li);
        // });
    }




    //all the awaits in these functions should actually be in a try catch
    async function addImage(imageUrl, newsId, imgPostUrl) {
        let images = await fetch(imagesUrl, { method: "POST", body: imgPostUrl });
        return images;
    }

    async function addComment(commentData, newsId, commentPostUrl) {
        let comment = await fetch(commentPostUrl, { method: "POST", body: JSON.stringify(commentData) });
        console.log('comment from post: ', comment.ok);
        return comment.ok;
    }

    async function editComment(commentData, editCommentUrl) {
        let comment = await fetch(editCommentUrl, { method: "PUT", body: JSON.stringify(commentData) });
        console.log('comment edited: ', comment.ok);
        return comment.ok;
    }

    async function getNewsImages(imagesUrl) {
        let images = await fetch(imagesUrl);
        return images.json();
    }

    async function getNewsComments(commentsUrl) {
        let comments = await fetch(commentsUrl);
        return comments.json();
    }

    async function getNewsById(id) {
        let loadingTag = loading(statusElem);
        let newsRaw = await fetch(`${baseUrl}/news/${id}`);
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

});





