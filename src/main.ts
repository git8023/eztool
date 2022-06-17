import ezt from '../lib'
import '../lib/style/dc-base.scss'
import {createApp} from 'vue';
import App from '@/App.vue';

createApp(App).mount('#app');

ezt.logs.trace('trace')
ezt.logs.debug('debug')
ezt.logs.info('info')
ezt.logs.warn('warn')
ezt.logs.error('error')
ezt.logs.fatal('fatal')
