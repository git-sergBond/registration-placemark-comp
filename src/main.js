import Vue from 'vue'
import axios from 'axios'
//import App from './App.vue'
import YmapPlugin from 'vue-yandex-maps';
Vue.use(YmapPlugin);
new Vue({
    el: '#app',
    data: {
        //данные для отправки
        send: {
            coords_0: 55,
            coords_1: 55,
            name: '',
            imageUrl: '',
            address: '',
            phoneNumber: '',
            price: '',
            url: '',
            info: '',
            index_500000: null
        },
        //гуишные ссылки
        coords: [55,55],
        placeMark: null//ссылка на метку на карте
    },
    methods: {
        initHandler: function (myMap) {
            //при инициализации библиотеки яндекс карт
            //добавляем метку которой можно менять координаты щелчком на карте
            this.placeMark = new ymaps.Placemark(this.coords, {}, {});
            myMap.geoObjects.add(this.placeMark);
            myMap.events.add('click', this.click_on_map);
        },
        click_on_map: function(event){
            //при клике на карте
            this.coords = event.get('coords');//запоминаем координаты
            this.placeMark.geometry.setCoordinates(this.coords);//меняем координаты метки
        },
        calculate_index_for_square: function(coord, table){
            let tableScale = [];
            // таблица масштабов
            // [масштаб] = [размер широты, оазмер долготы]
            tableScale[500000] = [2, 3];
            let degs = tableScale[table];//вытащили размеры ячейки из таблицы
            let index = (coord[0] / degs[0]) * (coord[1] / degs[1] + 1);
            return index;
        },
        sign_up_services: function () {
            //посчитали индекс квадранта для заданного масштабы
            this.send.index_500000 = this.calculate_index_for_square(this.coords, 500000);
            this.send.coords_0 = this.coords[0];
            this.send.coords_1 = this.coords[1];
            console.log(this.send);
            //отправили на сервер данные
            axios.post("https://localhost", this.send)
                .then(response => (this.info = response));
        }
    }
});
