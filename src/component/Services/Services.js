
const Servises = () => {

}
fetch('https://front-test.dev.aviasales.ru/search')
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Ошибка:', error))