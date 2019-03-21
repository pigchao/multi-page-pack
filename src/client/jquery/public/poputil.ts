/**
 * Created by lwc on 2016/11/2.
 */
import $ from "jquery";
import "./style/pop.less";

export default (() => {
  // Loading
  const Loading = () => {
    const settings = {
      dom: null,
      mask: null
    };

    function initDom() {
      let html = "";
      html += '<div id="js-loading-mask"></div>';
      html += '<div id="js-loading"></div>';

      $("body").append(html);

      settings.mask = $("#js-loading-mask");
      settings.dom = $("#js-loading");
    }

    return {
      show: () => {
        if (!settings.mask) {
          initDom();
        } else {
          $("body").append(settings.mask);
          $("body").append(settings.dom);
        }
        return this;
      },
      hide: () => {
        if (settings.mask) {
          settings.mask.remove();
          settings.dom.remove();
        }
        return this;
      }
    };
  };

  // 单例模式创建Loading组建
  let loadingInstance;

  function getLoadingInstance() {
    if (loadingInstance == null) {
      loadingInstance = Loading();
    }
    return loadingInstance;
  }

  // Prompt
  const Prompt = () => {
    const settings = {
      dom: null,
      timeoutId: -1
    };

    function initDom() {
      const html = '<div id="js-prompt"></div>';
      $("body").append(html);
      settings.dom = $("#js-prompt");
    }

    return {
      show(txt, timeout = 3000) {
        if (!settings.dom) {
          initDom();
        } else {
          $("body").append(settings.dom);
        }

        settings.dom.text(txt);
        settings.dom.fadeIn(200);

        clearTimeout(settings.timeoutId);
        if (timeout > 0) {
          settings.timeoutId = window.setTimeout(() => {
            this.hide();
          }, timeout);
        }
        return this;
      },

      hide() {
        if (settings.dom) {
          settings.dom.remove();
        }
        return this;
      }
    };
  };

  // 单例模式创建Prompt组建
  let promptInstance;

  function getPromptInstance() {
    if (promptInstance == null) {
      promptInstance = Prompt();
    }
    return promptInstance;
  }

  // Dialog
  const Dialog = options => {
    const settings = {
      mask: null,
      dom: null,
      button: [
        {
          text: "确定",
          callback: null
        }
      ],
      content: null,
      title: null
    };

    $.extend(settings, options);

    function initDom() {
      let html = "";
      html += '<div id="js-dialog-mask"></div>';
      html += '<div id="js-dialog">';
      if (settings.title) {
        html += `<div class="hd">${settings.title}</div>`;
      }
      html += '<div class="bd">';
      html += settings.content;
      html += "</div>" + '<div class="ft">';
      settings.button.forEach(item => {
        html += `<a class="btn" href="javascript:void(0)">${item.text}</a>`;
      });
      html += "</div>" + "</div>";

      $("body").append(html);

      settings.mask = $("#js-dialog-mask");
      settings.dom = $("#js-dialog");

      // event
      settings.dom.find(".ft .btn").each((index, item) => {
        const zItem = $(item);
        const callback = settings.button[index].callback || (() => this.hide());

        zItem.on({
          click: () => callback()
        });
      });
    }

    return {
      show() {
        if (!settings.mask) {
          initDom.call(this);
        }
        return this;
      },
      hide() {
        if (settings.mask) {
          settings.mask.remove();
          settings.dom.remove();
        }
        return this;
      }
    };
  };

  let dialogInstance;

  function getDialogInstance(options) {
    if (dialogInstance == null) {
      dialogInstance = Dialog(options);
    } else {
      dialogInstance.hide();
      dialogInstance = Dialog(options);
    }
    return dialogInstance;
  }

  return {
    loading: (() => {
      return getLoadingInstance();
    })(),
    prompt: (() => {
      const instance = getPromptInstance();
      return (txt, timeout?) => {
        if (txt) {
          instance.hide();
          instance.show(txt, timeout);
        }
        return instance;
      };
    })(),
    dialog(options) {
      const instance = getDialogInstance(options);
      return instance.show();
    }
  };
})();
