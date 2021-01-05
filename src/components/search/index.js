import './style.css';
import { getCategoriesSpecific } from '../../api/api';
import { data } from '../../data/data';
import axios from 'axios';
import cardTpl from '../catalog/categories-list-item/template/category.hbs';
import { refreshMain } from '../header/js/header';
const baseUrl = 'https://callboard-backend.herokuapp.com';

const main = document.querySelector('.categories-container');
const searchForm = document.querySelector('.js-search-form-desk');
const searchForm2 = document.querySelector('.js-search-form-tablet');

export const getSearchQuery = async query => {
  if (data.calls.categories.some(item => item.includes(query))) {
    const category = data.calls.categories.find(item => item.includes(query));
    if (data.calls.specificCategory[category].length) {
      return data.calls.specificCategory[category];
    } else {
      const result = await getCategoriesSpecific(category);
      return result.data;
    }
  } else {
    const result = await axios.get(`${baseUrl}/call/find?search=${query}`);
    return result.data;
  }
};

export const updateMarkup = goods => {
  main.innerHTML = `
    <button class="close-search-btn" type="button"><i class="fa fa-times" aria-hidden="true"></i></button>
    <div class="search-container">
      <ul class="search-gallery">${cardTpl(goods)}</ul>
    </div>
  `;
  getCloseBtn();
};

const getSearchItem = event => {
  event.preventDefault();
  let form = event.currentTarget;
  let inputValue = form.elements.query.value.toLowerCase();
  inMobileEnter(inputValue);
  form.reset();
};

const inMobileEnter = inputValue => {
  if (inputValue.length >= 1) {
    getSearchQuery(inputValue)
    .then(goods => {
      updateMarkup(goods);
      document.querySelector('.slider-container').innerHTML = '';
      })
      .catch(error => console.log(error));
  }
};

//====mobil=========
const mainInputMob = document.querySelector("input[name='query']");
const mobileInputBtn = document.querySelector('.mobile-input-btn');
//============

let inputValueForBtn = '';
let inputValue = '';
const getSearchItemMobile = event => {
  main.innerHTML = '';
  inputValue = event.target.value.toLowerCase();
  inputValueForBtn = event.target.value.toLowerCase();
  mobileInputBtn.addEventListener('click', e => {
    if (inputValueForBtn.length >= 1) {
      getSearchQuery(inputValueForBtn).then(goods => {
        updateMarkup(goods);
      });
    }
    mainInputMob.value = '';
  });
};

const onPressEnterSearch = event => {
  if (event.code === 'Enter') {
    if (mainInputMob.value.length >= 1) {
      getSearchQuery(mainInputMob.value)
        .then(goods => {
          updateMarkup(goods);
        })
        .catch(error => console.log(error));
    }
    mainInputMob.value = '';
  }
};

//========mobil=============
searchForm.addEventListener('submit', getSearchItem);
searchForm2.addEventListener('submit', getSearchItem);
mainInputMob.addEventListener('change', getSearchItemMobile);
document.addEventListener('keydown', onPressEnterSearch);

//===================closeBtn=============================

  const getCloseBtn = () => {
    const closeBtn = document.querySelector('.close-search-btn');
    closeBtn.addEventListener('click', refreshMain);
};
