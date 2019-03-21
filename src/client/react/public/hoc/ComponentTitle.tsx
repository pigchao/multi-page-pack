import * as React from "react";
import { isMobile } from "../../../../isomorphism/setting";

export const title = tit => (Component): any =>
  class SetTitleWrap extends React.PureComponent {
    constructor(props) {
      super(props);
      this.setDocumentTitle();
    }
    setDocumentTitle() {
      document.title = typeof tit === "function" ? tit(this.props) : tit;
      if (isMobile) {
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        const callback = () => {
          setTimeout(() => {
            iframe.removeEventListener("load", callback);
            document.body.removeChild(iframe);
          }, 0);
        };
        iframe.addEventListener("load", callback);
        document.body.appendChild(iframe);
      }
    }
    render() {
      return <Component {...this.props} />;
    }
  };
