chrome.runtime.onInstalled.addListener(() =>{
  // chrome.contextMenus.create({
  //   id : "dzMenu",
  //   title : "DZ Menu",
  //   contexts : ["all"]
  // });

  chrome.contextMenus.create({
    title: 'Найти "%s" в Conflu 🅰',
    contexts: ["selection"],
    id: "dz_text",
    //parentId: "dzMenu"
  });

  chrome.contextMenus.create({
    title: 'Открыть картинку',
    contexts: ["image"],
    id: "dz_image",
    //parentId: "dzMenu"
  });
});
    
chrome.contextMenus.onClicked.addListener((info, tab) =>
{
  switch(info.menuItemId){

    case'dz_text':
      chrome.tabs.create({
        url: `https://confluence.moscow.alfaintra.net/dosearchsite.action?queryString=${encodeURIComponent(info.selectionText)}`
      })
      break;

    case'dz_image':

      chrome.tabs.create(
        {"url": "html/page.html",active:false},(tab) => {        
          setTimeout(()=>{
            chrome.tabs.sendMessage(tab.id,info.srcUrl,(resp) => {
                chrome.tabs.update(tab.id,{active: true});
            });
          },500);               
        }
      );

    break;
  }
  console.log(tab, info);
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting === "hello")
      sendResponse({farewell: "goodbye"});
  }
);