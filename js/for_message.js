chrome.runtime.onMessage
    .addListener(function(message,sender,sendResponse) { 
        addImagesToContainer(message);               
        sendResponse("OK");
});

function addImagesToContainer(urls) {
    document.querySelector('.img').src = urls;
}