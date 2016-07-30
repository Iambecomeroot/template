'use strict';

const axios               = require('axios');

const $login              = document.getElementById('login');
const $login__email       = document.getElementById('login__email');
const $login__password    = document.getElementById('login__password');
const $login__error       = document.getElementById('login__error');

const $register           = document.getElementById('register');
const $register__email    = document.getElementById('register__email');
const $register__password = document.getElementById('register__password');
const $register__confirm  = document.getElementById('register__confirm');
const $register__error    = document.getElementById('register__error');

$login.addEventListener('submit', e => {
  e.preventDefault();
  e.stopPropagation();

  $login__error.innerHTML = '';

  const email    = $login__email.value;
  const password = $login__password.value;

  axios.post('/login', {email, password})
    .then(res => {
      console.log(res);

      if(res.data.success) location.reload();

      if(res.data.message){
        $login__error.innerHTML = res.data.message;
        $login__password.value  = '';
      }
    })
    .catch(err => {
      console.log(err);
    });
});

$register.addEventListener('submit', e => {
  e.preventDefault();
  e.stopPropagation();

  $register__error.innerHTML = '';

  const email    = $register__email.value;
  const password = $register__password.value;
  const confirm  = $register__confirm.value;

  axios.post('/register', {email, password, confirm})
    .then(res => {
      console.log(res);

      if(res.data.success) location.reload();

      if(res.data.message){
        $register__error.innerHTML = res.data.message;
        $register__password.value  = '';
        $register__confirm.value   = '';
      }
    })
    .catch(err => {
      console.log(err);
    });
});
