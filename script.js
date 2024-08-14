let isScrolling = true; // Global variable to track scrolling status
let scrollInterval; // Variable to store the interval ID

fetch('./images.json')
  .then(r => r.json())
  .then(j => main(j));

function main(_images) {
  window.images = _images.map(f => "./outputjpg/" + f);

  // Create a table element
  const table = document.createElement('table');

  // Number of columns
  const columns = isMobile() ? 3 : 7;
  const imageSize = 75;
  const columnSize = 100;

  // Calculate number of rows
  const rows = Math.ceil(window.images.length / columns);

  // Create rows and cells
  for (let i = 0; i < rows; i++) {
    const tr = document.createElement('tr');

    for (let j = 0; j < columns; j++) {
      const index = i * columns + j;
      const td = document.createElement('td');

      if (index < window.images.length) {
        const img = document.createElement('img');
        img.src = window.images[index];
        img.alt = `Image ${index}`;
        img.style.maxWidth = '300px'; // Adjust size as needed
        img.style.maxHeight = '300px'; // Adjust size as needed
        img.style.width = `calc(${imageSize}vw / ${columns})`
        td.appendChild(img);
      }

      td.style.width = `calc(${columnSize}% / ${columns})`;
      td.style.height = `calc(${columnSize}vw / ${columns})`

      tr.appendChild(td);
    }

    table.appendChild(tr);
  }

  document.getElementsByClassName("whitespace")[0].after(table);

  // Start scrolling when the page loads
  scrollPage();

  // Add a click event listener to toggle scrolling
  document.addEventListener('click', toggleScrolling);
}

function scrollPage() {
  const scrollSpeed = 2; // Speed of scrolling in pixels per interval
  const intervalTime = 10; // Interval time in milliseconds
  const waitAtBottom = 1000; // Duration to wait at the bottom before scrolling back to the top
  const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight - 8;

  let scrollingDown = true;

  scrollInterval = setInterval(() => {
    if (isScrolling) {
      if (scrollingDown) {
        window.scrollBy(0, scrollSpeed);

        if (window.scrollY >= maxScrollTop) {
          scrollingDown = false;
          setTimeout(() => {
            window.scrollTo(0, 0);
            scrollingDown = true;
          }, waitAtBottom);
        }
      } else {
        window.scrollBy(0, -scrollSpeed);

        if (window.scrollY <= 0) {
          scrollingDown = true;
        }
      }
    }
  }, intervalTime);
}

function toggleScrolling() {
  isScrolling = !isScrolling; // Toggle the scrolling status

  if (isScrolling) {
    scrollPage(); // Restart scrolling if it was stopped
  } else {
    clearInterval(scrollInterval); // Stop scrolling
  }
}

function isMobile() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  // List of common mobile device user agents
  return /android|iPad|iPhone|iPod|IEMobile|WPDesktop/i.test(userAgent);
}
