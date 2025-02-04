console.log("Started dz extension")

let a = document.querySelectorAll('body > pre > a')
if (Object.keys(a).length != 0) {
    Array.from(a).slice(1).forEach(e => {
        if(e.text.endsWith("docs.zip")){
            e.text = e.text + "!/index.html"
            e.target = "_blank"
            e.href = e.text
        }
    }
    )
}

//SET FAVICON
let link = document.querySelector("link[rel='icon']") || document.createElement('link');
link.rel = 'icon';
link.href = chrome.runtime.getURL("img/favicon.png");
document.head.appendChild(link);
