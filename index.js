var {remote, dialog} = require('electron')
var _ = require('lodash')
var $ = require("jquery")
var i18next = require("i18next")
var LngDetector = require("i18next-electron-language-detector")
var jqueryI18next = require("jquery-i18next")

//init lng engine
i18next.use(LngDetector).init({
  fallbackLng: 'en',
  resources: {
    en: {
      translation: {
        main: {
          header: 'Enter video URL',
          watch_button: 'Watch',
          errorurl: "URL is not right or not supported",
          error: "Error"
        },
        info: {
          version: "Version"
        }
      }
    },
    ru: {
      translation: {
        main: {
          header: 'Введите URL видео',
          watch_button: 'Смотреть',
          errorurl: "URL неправильный или не поддерживается",
          error: "Ошибка"
        },
        info: {
          version: "Версия"
        }
      }
    }
  }
}, function(err, t) {
  jqueryI18next.init(i18next, $);
  $('.first-page').localize();
});

//alwaysOnTop: true in BrowserWindow config doesnt work on linux
var win = remote.getCurrentWindow()
win.setAlwaysOnTop(true)

// exit button
$(".exit").click(function(){win.close()})

//back button
$(".back").click(function() {
  $(".first-page").css("display", "flex")
  $(".video").css("display","none")
  $(".back").css("display","none")
  $(".video-player").attr("src", "oops.html")
})

$(".about").click(function() {
  remote.dialog.showMessageBox(new remote.BrowserWindow({
    show: false,
    alwaysOnTop: true
  }),{type: "info", title: "flexPiP", message: `flexPiP`, detail: `${i18next.t("info.version")}: 0.0.1\nmegaworld network`})
})

// parse url function
function parseUrl(url) {
	var parser = document.createElement('a')
  parser.href = url
  
  var search = parser.search
  var pathname = parser.pathname.substring(1)
  var args = search.replace('?','')
  args = args.split('&')
  args.forEach(function(item, i, arr) {
    args[i] = item.split("=")
  })
  parser.args = args

  var paths = pathname.split('/')
  parser.paths = paths

	return parser
}
//first button
$(".first-button").click(function() {
  var urlinput = $(".first-input").val()
  if (!_.isEmpty(urlinput)) {
    var url = parseUrl(urlinput)
    if (url.protocol == "file:") {
      urlinput = "https://" + urlinput
      url = parseUrl(urlinput)
    }
    var domain = url.hostname
    switch(domain) {
      case 'youtube.com':
      case 'www.youtube.com':
        var uri = "https://www.youtube.com/embed/" + url.args[0][1]
        $(".first-page").css("display", "none")
        $(".video").css("display","block")
        $(".back").css("display","inline-block")
        $(".video-player").attr("src", uri)
        break;
      case 'youtu.be':
        var uri = "https://www.youtube.com/embed/" + url.pathname.replace('/','')
        $(".first-page").css("display", "none")
        $(".video").css("display","block")
        $(".back").css("display","inline-block")
        $(".video-player").attr("src", uri)
        break;
      case 'vk.com':
        var uri = "https://vk.com/video_ext.php?oid=-" + url.args[0][1].split("-")[1]
        $(".first-page").css("display", "none")
        $(".video").css("display","block")
        $(".back").css("display","inline-block")
        $(".video-player").attr("src", uri)
        break;
      case 'vimeo.com':
        var uri = 'https://player.vimeo.com/video/' + url.paths[2]
        $(".first-page").css("display", "none")
        $(".video").css("display","block")
        $(".back").css("display","inline-block")
        $(".video-player").attr("src", uri)
        break;
      case 'www.twitch.tv':
      case 'twitch.tv':
        var uri = "https://player.twitch.tv/?channel=" + url.pathname.replace('/','')
        $(".first-page").css("display", "none")
        $(".video").css("display","block")
        $(".back").css("display","inline-block")
        $(".video-player").attr("src", uri)
        break;
      case 'smotret-anime.ru':
        var uri = "https://smotret-anime.ru/translations/embed/" + url.paths[3].split("-")[2]
        $(".first-page").css("display", "none")
        $(".video").css("display","block")
        $(".back").css("display","inline-block")
        $(".video-player").attr("src", uri)
        break;
      default:
        remote.dialog.showMessageBox(new remote.BrowserWindow({show: false, alwaysOnTop: true}),{type:"info", title: i18next.t("main.error"), message:i18next.t("main.errorurl")})
    }
  }
})