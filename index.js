var {remote} = require('electron')
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
          header: "Enter video URL",
          watch_button: "Watch",
          errorurl: "URL is not right or not supported",
          error: "Error"
        },
        info: {
          version: "Version"
        },
        menu: {
          undo: "Undo",
          redo: "Redo",
          copy: "Copy",
          paste: "Paste",
          cut: "Cut",
          selectall: "Select All",
          quit: "Quit",
          about: "About",
          edit: "Edit"
        }
      }
    },
    ru: {
      translation: {
        main: {
          header: "Введите URL видео",
          watch_button: "Смотреть",
          errorurl: "URL неправильный или не поддерживается",
          error: "Ошибка"
        },
        info: {
          version: "Версия"
        },
        menu: {
          undo: "Отменить",
          redo: "Вернуть",
          copy: "Копировать",
          paste: "Вставить",
          cut: "Вырезать",
          selectall: "Выбрать все",
          quit: "Выйти",
          about: "О приложении",
          edit: "Правка"
        }
      }
    }
  }
}, function(err, t) {
  jqueryI18next.init(i18next, $);
  $('.first-page').localize();
});

var template = [{
  label: "Application",
  submenu: [
      { label: i18next.translator.translate("menu.about"), click: function() { 
        win.setAlwaysOnTop(false)
        remote.dialog.showMessageBox(win, {type: "info", title: "flexPiP", message: "flexPiP", buttons: ["OK"], detail: `${i18next.t("info.version")}: ${remote.app.getVersion()}\nmegaworld network`}, function() {
          win.setAlwaysOnTop(true)
        })
       } },
      { type: "separator" },
      { label: i18next.translator.translate("menu.quit"), accelerator: "Command+Q", click: function() { app.quit(); }},
      { label: "Open WebTools", click: function() { win.webContents.openDevTools(); }}
  ]}, {
  label: i18next.translator.translate("menu.edit"),
  submenu: [
      { label: i18next.translator.translate("menu.undo"), accelerator: "CmdOrCtrl+Z", selector: "undo:" },
      { label: i18next.translator.translate("menu.redo"), accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
      { type: "separator" },
      { label: i18next.translator.translate("menu.cut"), accelerator: "CmdOrCtrl+X", selector: "cut:" },
      { label: i18next.translator.translate("menu.copy"), accelerator: "CmdOrCtrl+C", selector: "copy:" },
      { label: i18next.translator.translate("menu.paste"), accelerator: "CmdOrCtrl+V", selector: "paste:" },
      { label: i18next.translator.translate("menu.selectall"), accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
  ]}
];

remote.Menu.setApplicationMenu(remote.Menu.buildFromTemplate(template));

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
//about button
$(".about").click(function() {
  win.setAlwaysOnTop(false)
  remote.dialog.showMessageBox(win, {type: "info", title: "flexPiP", message: "flexPiP", buttons: ["OK"], detail: `${i18next.t("info.version")}: ${remote.app.getVersion()}\nmegaworld network`}, function() {
    win.setAlwaysOnTop(true)
  })
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
    // check if url is without https://
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
        win.setAlwaysOnTop(false)
        remote.dialog.showMessageBox(win, {type:"error", title: i18next.t("main.error"), message:i18next.t("main.errorurl")}, function() {
          win.setAlwaysOnTop(true)
        })
    }
  }
})