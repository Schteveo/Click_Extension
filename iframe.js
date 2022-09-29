chrome.extension.onRequest.addListener((request, sender, sendResponse) => {
    if(request.id_bool){
        document.getElementById(request.button_class).click();
    }
    else{
        document.getElementsByClassName(request.button_class)[0].click();
    }
    sendResponse({clicked: true});
});