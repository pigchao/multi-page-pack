import React from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import withStyles, { StyledComponentProps } from "@material-ui/styles/withStyles";

let div;
let timeout;
let timeoutId = -1;

export function hidePrompt(callback?) {
  clearTimeout(timeoutId);
  if (div != null) {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);

    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
      div = null;
    }
    if (typeof callback === "function") {
      callback();
    }
  }
}

export function showPrompt(param) {
  if (div == null) {
    div = document.createElement("div");
    document.body.appendChild(div);
  }
  const config = typeof param === "string" ? { content: param } : { ...param };
  timeout = typeof config.timeout === "undefined" ? (config.loading ? 150000 : 1500) : config.timeout;
  ReactDOM.render(<Prompt {...{ ...config, visible: true }} />, div);
  window.clearTimeout(timeoutId);
  if (timeout > 0) {
    timeoutId = window.setTimeout(() => {
      hidePrompt(config.callback);
    }, timeout);
  }
}

interface PromptProps {
  content: string;
  visible?: boolean;
  showMask?: boolean;
  loading?: boolean;
  timeout?: number;
}

const styles = {
  mask: {
    display: "block",
    position: "fixed" as "fixed",
    "z-index": 1000,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden" as "hidden",
    "background-color": "#000000",
    opacity: 0.3
  },
  wrap: {
    position: "fixed" as "fixed",
    zIndex: 1001,
    right: 0,
    bottom: 0,
    left: 0,
    height: "100%",
    display: "flex",
    "align-items": "center" as "center",
    "justify-content": "center" as "center",
    transform: "translateZ(1px)"
  },
  prompt: {
    padding: "10px 15px",
    maxWidth: "80%",
    "background-color": "rgba(0,0,0,.5)",
    "border-radius": "5px",
    color: "#FFFFFF",
    "font-size": "1.4rem",
    "line-height": 1.3,
    display: "flex"
  },
  loading: {
    "font-size": "18px",
    "margin-right": "5px"
  },
  loadingSpinners: {
    position: "relative" as "relative",
    display: "block",
    width: "1em",
    height: "1em"
  },
  loadingSpinner: {
    position: "absolute" as "absolute",
    left: "44.5%",
    top: "37%",
    width: "2px",
    height: "25%",
    "border-radius": "50%/20%",
    opacity: 0.25,
    "background-color": "currentColor",
    animation: "$spinner-fade 1s linear infinite",
    "&:first-child": {
      "animation-delay": "0s",
      transform: "rotate(-150deg) translateY(-150%)"
    },
    "&:nth-child(2)": {
      "animation-delay": ".083333333333333s",
      transform: "rotate(-120deg) translateY(-150%)"
    },
    "&:nth-child(3)": {
      "animation-delay": ".166666666666667s",
      transform: "rotate(-90deg) translateY(-150%)"
    },
    "&:nth-child(4)": {
      "animation-delay": ".25s",
      transform: "rotate(-60deg) translateY(-150%)"
    },
    "&:nth-child(5)": {
      "animation-delay": ".333333333333333s",
      transform: "rotate(-30deg) translateY(-150%)"
    },
    "&:nth-child(6)": {
      "animation-delay": ".416666666666667s",
      transform: "rotate(0deg) translateY(-150%)"
    },
    "&:nth-child(7)": {
      "animation-delay": ".5s",
      transform: "rotate(30deg) translateY(-150%)"
    },
    "&:nth-child(8)": {
      "animation-delay": ".583333333333333s",
      transform: "rotate(60deg) translateY(-150%)"
    },
    "&:nth-child(9)": {
      "animation-delay": ".666666666666667s",
      transform: "rotate(90deg) translateY(-150%)"
    },
    "&:nth-child(10)": {
      "animation-delay": ".75s",
      transform: "rotate(120deg) translateY(-150%)"
    },
    "&:nth-child(11)": {
      "animation-delay": ".833333333333333s",
      transform: "rotate(150deg) translateY(-150%)"
    },
    "&:nth-child(12)": {
      "animation-delay": ".916666666666667s",
      transform: "rotate(180deg) translateY(-150%)"
    }
  },
  content: {
    overflow: "hidden" as "hidden",
    "text-overflow": "ellipsis"
  },
  "@keyframes spinner-fade": {
    "0%": {
      opacity: 0.85
    },
    "50%": {
      opacity: 0.25
    },
    to: {
      opacity: 0.25
    }
  }
};

@withStyles(styles)
class Prompt extends React.PureComponent<PromptProps & StyledComponentProps> {
  static defaultProps = {
    timeout: 1500
  };
  static getDerivedStateFromProps(nextProps, preState) {
    if (nextProps.visible !== preState.visible) {
      return {
        visible: nextProps.visible
      };
    }
    return null;
  }

  state = { visible: false };

  render() {
    const { visible } = this.state;
    if (!visible) {
      return null;
    }
    const { showMask, loading, content, classes } = this.props;
    return ReactDOM.createPortal(
      <>
        {showMask && <div className={classes.mask} />}
        <div className={classes.wrap}>
          <div className={classNames(classes.prompt)}>
            {loading && (
              <div className={classes.loading}>
                <span className={classes.loadingSpinners}>
                  <i className={classes.loadingSpinner} />
                  <i className={classes.loadingSpinner} />
                  <i className={classes.loadingSpinner} />
                  <i className={classes.loadingSpinner} />
                  <i className={classes.loadingSpinner} />
                  <i className={classes.loadingSpinner} />
                  <i className={classes.loadingSpinner} />
                  <i className={classes.loadingSpinner} />
                  <i className={classes.loadingSpinner} />
                  <i className={classes.loadingSpinner} />
                  <i className={classes.loadingSpinner} />
                  <i className={classes.loadingSpinner} />
                </span>
              </div>
            )}
            <span className={classes.content} dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
      </>,
      document.body
    );
  }
}
