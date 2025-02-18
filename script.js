//Starting download option
document.addEventListener("DOMContentLoaded", () => {
    const iconButton = document.getElementById("icon");
    const downloadOptions = document.getElementById("download-options");
    const closeButton = document.querySelector("[data-icon-close]");

    iconButton.addEventListener("click", () => {
        downloadOptions.classList.add("active");
    });

    closeButton.addEventListener("click", () => {
        downloadOptions.classList.remove("active");
    });

    // Close when clicking outside the download options
    document.addEventListener("click", (event) => {
        if (!downloadOptions.contains(event.target) && event.target !== iconButton) {
            downloadOptions.classList.remove("active");
        }
    });
});

//how it works portion
const openButton = document.querySelectorAll('[data-htw-target]')
const closeButton = document.querySelectorAll('[data-htw-close]')
const overlay = document.getElementById('overlay')

openButton.forEach( button =>{
    button.addEventListener('click', () =>{
        const content = document.querySelector(button.dataset.htwTarget)
        openContent(content)
    })
})

overlay.addEventListener('click', (event) => {
    if (event.target === overlay) { // Ensures click is directly on the overlay
        const contentsOverlay = document.querySelectorAll('.htw-content.active')
        contentsOverlay.forEach(content => {
            closeContent(content);
        });
    }
});

closeButton.forEach( button =>{
    button.addEventListener('click', () =>{
        const content = button.closest('.htw-content')
        closeContent(content)
    })
})

function openContent(content){
    if(content==null)
        return
    content.classList.add('active')
    overlay.classList.add('active')
}

function closeContent(content){
    if(content==null)
        return
    content.classList.remove('active')
    overlay.classList.remove('active')
}

//feedback function
function check(){
    let str = document.getElementById('feedback').value
    console.log(str)
}
