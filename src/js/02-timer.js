import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const refs = {
  input: document.querySelector('input#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  resetBtn: document.querySelector('[data-reset]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minute: document.querySelector('span[data-minutes]'),
  second: document.querySelector('[data-seconds]'),
};

let intervalId = null;
refs.startBtn.disabled = true;
refs.resetBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    handleSelectedDate(selectedDates[0]);
  },
};

flatpickr('#datetime-picker', options);

function handleSelectedDate(selectedDate) {
  if (selectedDate < new Date()) {
    refs.startBtn.disabled = true;
    Notiflix.Notify.failure('Please choose a date in the future');
    return;
  }
  if (selectedDate > new Date()) {
    refs.startBtn.disabled = false;
  }

  refs.startBtn.addEventListener('click', () => {
    refs.input.disabled = true;
    refs.startBtn.disabled = true;
    refs.resetBtn.disabled = false;
    clearInterval(intervalId);
    refs.days.textContent = '00';
    refs.hours.textContent = '00';
    refs.minute.textContent = '00';
    refs.second.textContent = '00';

    intervalId = setInterval(() => {
      const differenceInTime = selectedDate - new Date();
      if (differenceInTime < 1000) {
        clearInterval(intervalId);
        refs.input.disabled = false;
        refs.resetBtn.disabled = true;
      }
      const result = convertMs(differenceInTime);
      viewOfTimer(result);
    }, 1000);
  });
}

refs.resetBtn.addEventListener('click', () => {
  clearInterval(intervalId);
  refs.input.disabled = false;
  refs.startBtn.disabled = false;
  refs.resetBtn.disabled = true;
  refs.days.textContent = '00';
  refs.hours.textContent = '00';
  refs.minute.textContent = '00';
  refs.second.textContent = '00';
});

function viewOfTimer({ days, hours, minutes, seconds }) {
  refs.days.textContent = `${days}`;
  refs.hours.textContent = `${hours}`;
  refs.minute.textContent = `${minutes}`;
  refs.second.textContent = `${seconds}`;
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = addLeadingZero(Math.floor(ms / day));
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
}
