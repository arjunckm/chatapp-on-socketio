const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $locationButton = document.querySelector('#sendLocation')

const $messages = document.querySelector("#messages")
const messageTemplete = document.querySelector("#message-template").innerHTML
const locationMsgTemp = document.querySelector("#locationMessage-template").innerHTML

socket.on("message", (msg) => {
    const html = Mustache.render(messageTemplete, {
        message: msg
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on("locationMessage", (url) => {
    const html = Mustache.render(locationMsgTemp, {
        locationUrl: url
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')

    const msg = e.target.elements.message.value

    socket.emit('sendMessage', msg, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ""
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }
        console.log("Message Delivered")
    })
})

document.querySelector("#sendLocation").addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert("Geolocation is not supported by browser")
    }
    $locationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            lat: position.coords.latitude,
            long: position.coords.longitude
        }, () => {
            $locationButton.removeAttribute('disabled')
            console.log("Location Shared!")
        })
    })
})
