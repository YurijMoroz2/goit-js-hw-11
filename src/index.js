import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '41162617-43e33508aa3949fdb22cf209d';
const BASE_URL = 'https://pixabay.com/api/';
const form = document.querySelector('.search-form');
const input = document.querySelector('input');
const btn = document.querySelector('button');
const container = document.querySelector('.gallery-list');
const galleryBox = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
const inputElement = document.querySelector('input[name="searchQuery"]');
const searchForm = document.querySelector('#search-form');
// -------------------------------------------------------------------------
let page = 1;
let per_page = 40;
// --------------------------Input-------------------------------------------------
input.addEventListener('input', handleInput);
function handleInput(event) {
  resetPage();
  btn.disabled = false;
  // console.log(event.currentTarget.value);
  // console.log(inputElement.value);
  if (!inputElement.value.ok) {
    event.preventDefault();
    container.innerHTML = '';
    loadMore.style.display = 'none';
  }
}
// ----------------------------------------------------------------------------------
function createMarcup(arr) {
  return arr
    .map(
      ({
        id,
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<li class ="gallery-item">
<div class="photo-card">
<a class ="gallery__link" href = "${largeImageURL}">        
<img class = "gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" "/>
</a>        
<div class="info">
<p class="info-item">
<b>Likes<br>${likes}</br></b>
</p>
<p class="info-item">
<b>Views<br>${views}</br></b>
</p>
<p class="info-item">
<b>Comments<br>${comments}</br></b>
</p>
<p class="info-item">
<b>Downloads<br>${downloads}</br></b>
</p>
</div>
</div>
</li>
`
    )
    .join('');
}
// -------------------Submit----------------------------
let object;
form.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  container.style.listStyle = 'none';
  const searchQuery = inputElement.value;
  // console.log("searchQuery",searchQuery.length);

  const postData = new FormData(form);
  const obj = Object.fromEntries(postData.entries());
  // console.log(obj);
  object = obj.searchQuery;

  serviceTodos()
    .then(value => {
      // console.log(value)
      if (value.hits.length !== 0) {
        value.totalHits < per_page
          ? (loadMore.style.display = 'none')
          : (loadMore.style.display = 'block');
        Notiflix.Notify.success(`Hooray! We found ${value.totalHits} images.`);
      } else {
        loadMore.style.display = 'none';
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
    })
    .catch(error => {
      console.log(error);
    });
  render().then(ren => {
    //   console.log(ren);
    btn.disabled = true;
  });
}
// -------------------------------GetURL-----------------------------------
async function serviceTodos(page = 1) {
  const qweryParams = new URLSearchParams({
    key: API_KEY,
    q: `${object}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: page,
    per_page: per_page,
  });
  try {
    const response = await axios(`${BASE_URL}?${qweryParams}`);
    return await response.data;
  } catch (error) {
    console.log('Error!!!!', error);
  }
}
// --------------------------------LoadMore--------------------------------------------------------------

loadMore.addEventListener('click', onLoadMore);
async function onLoadMore(event) {
  try {
    event.preventDefault();
    page += 1;
    const data = await serviceTodos(page);
    per_page += 40;
    // console.log('loadMore', data);
    container.insertAdjacentHTML('beforeend', createMarcup(data.hits));
    gallery = new SimpleLightbox('.gallery a', {
        spinner: 'true',
        captionsData: 'alt',
        enableKeyboard: 'true',
      });
      gallery.refresh();
    // console.log('page1', page);
    // console.log('per_page onLoadMore', per_page);

    const { height: cardHeight } =
      container.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });


    if (per_page >= data.totalHits) {
      // console.log("data.totalHits",data.totalHits);
      Notiflix.Report.info(
        'Info',
        "We're sorry, but you've reached the end of search results."
      );
      loadMore.style.display = 'none';
    }
    throw new Error(error);
  } catch (error) {
    console.log('Error__LoadMore', error.message);
  }
}
// -----------------------Render----------------------------------------------------------
async function render() {
  try {
    const data = await serviceTodos();
    // console.log('render', data);
    container.insertAdjacentHTML('beforeend', createMarcup(data.hits));
    gallery = new SimpleLightbox('.gallery a', {
        spinner: 'true',
        captionsData: 'alt',
        enableKeyboard: 'true',
    });
    gallery.refresh();
    return await data;
  } catch (error) {
    console.log(error.message);
  }
}

// ------------------------------------------

function resetPage() {
  page = 1;
  per_page = 40;
  // console.log(page,per_page);
}
//   -----------------------натисни 1-------------------------------------------
document.addEventListener('keydown', function (event) {
  if (event.key === '1') {
    window.scrollTo(0, 0);
  }
});
