(function (window, dews, $, CodeMirror, History) {

  function reindent(source) {
    var lineRegex = /^(?!(?:[ ]*[\r?\n])).*$/mg,
      countRegex = /^[ ]+/,
      replaceRegex,
      validLines,
      firstLine,
      firstLineSpaces,
      spaceCount;

    validLines = source.match(lineRegex); // 유효한 라인 (공백만 있는 라인 제외)
    if (validLines && validLines.length > 0) {
      firstLine = validLines[0];
      firstLineSpaces = firstLine.match(countRegex);

      if (firstLineSpaces && firstLineSpaces.length > 0) {
        spaceCount = firstLineSpaces[0].length;

        replaceRegex = new RegExp("^[ ]{" + spaceCount + "}", "mg");
        source = source.replace(replaceRegex, '');
      }
    }

    return source;
  }

  $.extend(true, dews, {
    demo: {
      source: function (tab, id, type, height) {
        var $sample = $('#' + id, $('#content_' + tab)),
          $parent = $sample.parent(),
          $textarea = $('<textarea />'),
          html,
          mode = 'htmlmixed',
          editor;

        if (!type) {
          type = 'html';
        }

        if (type === 'js') {
          $sample = $('#' + id + '_js', $('#content_' + tab));
          mode = 'javascript';
          html = $sample.html();
          $sample.hide();
        } else if (type === 'html') {
          html = $sample.html();
        } else {
          dews.ajax.get(type, {
            async: false
          }).done(function (data) {
            html = data;
          });
        }

        html = reindent(html);
        html = html.replace(/^[ ]*\/\/# sourceURL=.+$/mg, '');

        $textarea.attr('id', id + '_text');
        $textarea.val($.trim(html));
        $textarea.insertAfter($sample);

        editor = CodeMirror.fromTextArea($textarea.get(0), {
          mode: mode,
          readOnly: true,
          lineNumbers: true,
          viewportMargin: Infinity
        });

        if (height > 0) {
          editor.setSize("100px", height);
        }

        return editor;
      },
      navigation: {
        /**
         * 메뉴 초기화
         * @param $container
         * @private
         */
        init: function ($container) {
          var $ul, search, matches, hash,
            regex = /[?&]p=(.*)$/i,
            trigger = function (e) {
              var url;

              // 외부 링크를 제외하고 History 기능 이용
              if ($(this).attr('target') !== '_blank') {
                e.preventDefault();

                if (History.enabled) {
                  url = dews.url.getNormalizedUrl($(this).attr('href'));

                  if (url !== '#') {
                    if (!dews._isDebugMode()) {
                      History.pushState({page: url}, document.title, '?p=' + url);
                    } else {
                      History.pushState({page: url}, document.title, '?debug=true&p=' + url);
                    }

                  }
                }
              }
            };

          $ul = $('ul.rootList', $container);

          if (History.enabled) {
            History.Adapter.bind(window, 'statechange', function () {
              var state,
                url;

              state = History.getState();

              if (state.data.hasOwnProperty('page')) {
                url = state.data.page;
              }

              if (url && url !== '#') {
                dews.demo.navigation.navigate(url);
              } else {
                document.location.reload();
              }
            });

            // 최초 로딩시
            search = History.getState().cleanUrl;

            if (search) {

              matches = search.match(regex);

              if (matches) {
                hash = matches[1];

                dews.demo.setMenus('lnb').setSelectVariableInsert($ul.find('a[href="' + hash + '"]').index(), $ul.find('a[href="' + hash + '"]').parent().parent().parent().index(), $ul.find('a[href="' + hash + '"]').parent().parent().parent().parent().parent().index());

                if (hash.startsWith('/')) {
                  hash = '~' + hash;
                } else {
                  hash = '~/' + hash;
                }
                dews.demo.navigation.navigate(dews.url.getAbsoluteUrl(hash));
              } else {
                dews.demo.navigation.navigate("main/main.html");
              }
            }
          }
          $ul.find('a').on('click', trigger);
        },
        navigate: function (url) {
          var evt = $.Event('navigated');
          $(window).trigger(evt);
          $(window).unbind('beforeunload');
          dews.ajax.load(dews.demo.content, url);
          $('html,body').animate({scrollTop: 0}, 500);
        }
      }
    }
  });
})(window, window.dews, window.jQuery, window.CodeMirror, window.History);


/**
 * 테마 선택기 네임스페이스
 */
(function () {
  var getThemes = function () {
    return [
      {
        name: 'd-erp',
        desc: 'D-ERP 테마',
        colors: [
          { name: 'blue', color: '#1c90fb' },
          { name: 'cyan', color: '#2ba6ad' },
          { name: 'green', color: '#51b44f' },
          { name: 'indigo', color: '#3c61c2' },
          { name: 'orange', color: '#f87e2d' },
          { name: 'purple', color: '#7469cc' },
          { name: 'red', color: '#d94c35' }
        ]
      },
      {
        name: 'gscaltex',
        desc: 'GS칼텍스'
      }
    ]
  }
  /**
   * 셀렉터가 선택한 아이디의 테마로 변경하는 함수
   * @private
   */
  function changeTheme() {
    var themeId = $('#themeSelector').val();
    var previousColor = $.type(sessionStorage.getItem('dews:theme:id')) === 'undefined' ? 'blue' : sessionStorage.getItem('dews:theme:id');
    if (dews.theme && $.type(dews.theme.changeTheme) === 'function') {
      dews.theme.changeTheme(previousColor, themeId);
    }
    sessionStorage.setItem('dews:theme:id', themeId);
  }
  /**
   * 셀렉터가 선택한 색상 테마로 변경하는 함수
   */
  function changeColor() {
    var themeId = $('#colorSelector').val(),
        theme = sessionStorage.getItem('dews:color:id'),
        $colorTheme = $('link[data-role=dews-theme]'),
        $dewsTheme = $('link[data-role=color-theme]'),
        main = $colorTheme.attr('href'),
        dews = $dewsTheme.attr('href');

    $colorTheme.attr('href', main.replace(theme, themeId ? themeId : ''));
    $dewsTheme.attr('href', dews.replace(theme, themeId ? themeId : ''));

    sessionStorage.setItem('dews:color:id', themeId);
  }
  /**
   * 테마 셀렉터를 로드하는 함수
   * @private
   */
  function themeSelectorLoad(){
    var $notificationArea = $('#notification-area'),
        $wrapper, $select, $option, $themes, themeId, i, size, $wrapper1, $select1, $option1, $themes1, themeId1;

    if($notificationArea.length) {
      // 알람 영역이 추가되었을 때 테마 선택기를 생성
      $notificationArea.empty();
      $select = $('<select></select>').attr('id', 'themeSelector')
                                      .addClass('dews-ui-dropdownlist');

      // 테마 목록을 option으로 추가
      $themes = getThemes();
      for(i=0, size = $themes.length; i<size; i++) {
        $option = $('<option></option>').text($themes[i].desc);
        $select.append($option);
      }
      $select.on('change', changeTheme);

      // 세션 스토리지에서 이전에 선택한 테마를 얻어옴
      themeId = sessionStorage.getItem('dews:theme:id');
      if($.type(themeId) !== 'string') {
        $select.val($('option:first', $select).val());
        sessionStorage.setItem('dews:theme:id', $('option:first', $select).val());
      } else {
        $select.val(themeId);
      }

      $select1 = $('<select></select>').attr('id', 'colorSelector')
        .addClass('dews-ui-dropdownlist');

      $themes1 = $themes[0].colors;
      for(i=0; i < $themes1.length; i++) {
        $option1 = $('<option></option>').text($themes1[i].name);
        $select1.append($option1);

      }
      $select1.on('change', changeColor);

      themeId1 = sessionStorage.getItem('dews:color:id');
      if ($.type(themeId) !== 'string') {
        $select1.val($('option:first', $select1).val());
      } else {
        $select1.val(themeId1);
        $("link[data-role='dews-theme']").attr('href', $("link[data-role='dews-theme']").attr('href').replace('blue', themeId1));
        $("link[data-role='color-theme']").attr('href', $("link[data-role='color-theme']").attr('href').replace('blue', themeId1));
      }

      // HTML 요소로 추가
      $wrapper = $('<div></div>').attr('id', 'themeSelectorWrapper').append($select);
      $notificationArea.append($wrapper);

      $wrapper1 = $('<div></div>').attr('id', 'colorSelectorWrapper').append($select1);

      $notificationArea.append($wrapper1);

      // DEWS 드롭다운리스트로 초기화
      dews.ui.dropdownlist('#themeSelectorWrapper select');
      dews.ui.dropdownlist($select1);

      // 얻어온 이전 테마 적용
      $select.change();
      $select1.change();

    } else {
      setTimeout(themeSelectorLoad, 100);
    }
  }
  /**
   * DEWS가 로드된 이후 알람 영역이 생성될 때까지 체크
   */
  themeSelectorLoad();
})();