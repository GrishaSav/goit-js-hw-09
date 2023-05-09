import Notiflix from 'notiflix';

const form = document.querySelector('.form');

form.addEventListener('submit', onFormSubmit);

function onFormSubmit(evt) {
  evt.preventDefault();
  
  let delay = evt.currentTarget.delay.valueAsNumber;
  const step = evt.currentTarget.step.valueAsNumber;
  const amountOfPromise = evt.currentTarget.amount.valueAsNumber;

  if (delay < 0 || step < 0 || amountOfPromise <= 0) {
    Notiflix.Notify.warning('Input values should be positive');
    return;
  }

  let currentDelay = delay;

  for (let position = 1; position <= amountOfPromise; position += 1) {
    createPromise(position, currentDelay)
      .then(({ position, delay }) => {
        Notiflix.Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notiflix.Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
      });

    currentDelay += step;
  };
}

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
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
