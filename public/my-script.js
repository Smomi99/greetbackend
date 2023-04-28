const API_URL ="https://complete-greet.onrender.com"
fetch(`${API_URL}/my-html-content`)
  .then(response => response.text())
  .then(html => {
    document.querySelector('#my-html-content').innerHTML = html;
  });