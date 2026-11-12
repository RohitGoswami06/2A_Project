fetch('footer.html')
    .then(r => r.text())
    .then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const footer = doc.querySelector('footer');
        if (footer) {
            document.getElementById('footer-nav').innerHTML = footer.outerHTML;
        }
    });
