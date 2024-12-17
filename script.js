const settingsBtn = document.querySelector('.settings-btn')
const modal = document.getElementById('modal')


settingsBtn.addEventListener('click', ()=>{
    modal.classList.toggle('hide')
})