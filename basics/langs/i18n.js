import Vue from 'vue'
import VueI18n from 'vue-i18n'
import locale from 'element-ui/lib/locale'
import messages from './messages'

window._editorConfig = {
  locale: 'zh-cn'
}
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: window._editorConfig.locale,
  messages
})
// 重点：为了实现element插件的多语言切换
locale.i18n((key, value) => i18n.t(key, value))

window.$i18n = i18n
export default i18n
