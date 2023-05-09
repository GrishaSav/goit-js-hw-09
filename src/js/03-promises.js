import Notiflix from 'notiflix';

const form = document.querySelector('.form');

form.addEventListener('submit', onFormSubmit);

function onFormSubmit(evt) {
  evt.preventDefault();

  const { delay: mainDelay, step: delayStep, amount: amountOfPromise } = evt.currentTarget;

  if (mainDelay < 0 || delayStep < 0 || amountOfPromise <= 0) {
    Notiflix.Notify.warning('Input values should be positive');
    return;
  }

  for (let position = 1; position <= amountOfPromise; position += 1) {
    createPromise(position, mainDelay)
      .then(({ position, delay }) => {
        Notiflix.Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notiflix.Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
      });

    mainDelay += delayStep;
  };
}

function createPromise(position, delay) {
  const promise = new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;

    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}