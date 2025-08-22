import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/home/index.vue';
import FreshNews from '../views/freshNews/index.vue';
import SecondHand from '../views/secondHand/index.vue';
import car from '../views/car/index.vue';
import work from '../views/work/index.vue';
import realEstate from '../views/realEstate/index.vue';

// import NotFound from '../views/NotFound.vue';
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
       
    },
    {
        path: '/freshNews',
        name: 'FreshNews',
        component: FreshNews,
    },
    {
        path: '/secondHand',
        name: 'SecondHand',
        component: SecondHand,
    },
    {
        path: '/car',
        name: 'car',
        component: car,
    },
    {
        path: '/work',
        name: 'work',
        component: work,
    },
    {
        path: '/realEstate',
        name: 'realEstate',
        component: realEstate,
    },  
    ];
const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;