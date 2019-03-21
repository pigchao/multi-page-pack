import React from "react";
import ReactDOM from "react-dom";
import withStyles, { StyledComponentProps } from "@material-ui/styles/withStyles";
import { isNotNull, isNull } from "../../../../../isomorphism/fun";
import HalfBorder from "../HalfBorder";

let div;

export function hideDialog() {
  if (isNotNull(div)) {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
      div = null;
    }
  }
}

export function showDialog(param) {
  const config = typeof param === "string" ? { content: param } : param;
  if (isNull(div)) {
    div = document.createElement("div");
    document.body.appendChild(div);
  }
  ReactDOM.render(<Dialog {...{ ...config, visible: true }} />, div);
}

interface DialogProps {
  title?: string;
  content: string;
  button?: any[];
  visible?: boolean;
}

const styles = {
  mask: {
    display: "block",
    position: "fixed" as "fixed",
    zIndex: 1000,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden" as "hidden",
    backgroundColor: "#000000",
    opacity: 0.3
  },
  wrap: {
    position: "fixed" as "fixed",
    zIndex: 1002,
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
    textAlign: "center" as "center"
  },
  dialog: {
    display: "inline-block",
    width: "75%",
    color: "#4A4A4A",
    background: "#FFFFFF",
    boxShadow: "0 2px 4px 0 rgba(100, 113, 251, 0.10)",
    borderRadius: "8px",
    textAlign: "center" as "center"
  },
  head: {
    paddingTop: "20px",
    fontSize: "16px",
    fontWeight: "bold" as "bold"
  },
  body: {
    textAlign: "left" as "left",
    padding: "14px 14px 20px",
    lineHeight: "20px",
    fontSize: "14px"
  },
  foot: {
    position: "relative" as "relative",
    display: "flex"
  },
  button: {
    flex: 1,
    display: "block",
    fontSize: "14px",
    color: "#469CFA",
    padding: "10px 0",
    borderRight: "1px solid #EDEDED",
    textAlign: "center" as "center",
    "&:last-child": {
      borderRight: "0 none"
    }
  }
};

class Button extends React.PureComponent<{
  classes: any;
  item: any;
  onClick: (item) => void;
}> {
  render() {
    const { classes, item } = this.props;
    return (
      <a className={classes.button} onClick={this.onClick}>
        {item.text}
      </a>
    );
  }
  onClick = () => {
    this.props.onClick(this.props.item);
  };
}

@withStyles(styles)
export default class Dialog extends React.PureComponent<DialogProps & StyledComponentProps, any> {
  static getDerivedStateFromProps(nextProps, preState) {
    if (nextProps.visible !== preState.visible) {
      return {
        visible: nextProps.visible
      };
    }
    return null;
  }

  state = { visible: false };
  dialogDOM: HTMLElement;

  getRef = ref => {
    if (isNotNull(ref)) {
      this.dialogDOM = ref;
    }
  };

  onClick = item => {
    if (isNull(item.callback) || item.callback() !== false) {
      hideDialog();
    }
  };

  componentDidMount() {
    this.doLocate();
  }

  componentDidUpdate(preProps, preState) {
    if (this.state.visible !== preState.visible && this.state.visible) {
      this.doLocate();
    }
  }

  doLocate = () => {
    if (isNotNull(this.dialogDOM)) {
      const rect = this.dialogDOM.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const top = (windowHeight - rect.height) / 3; // 弹框定位在屏幕1/3位置
      this.dialogDOM.style.marginTop = `${top}px`;
    }
  };

  render() {
    const { visible } = this.state;
    const { title, content, button = [{ text: "OK" }], classes } = this.props;
    if (!visible) {
      return null;
    }
    return (
      <>
        <div className={classes.mask} />
        <div className={classes.wrap}>
          <div className={classes.dialog} ref={this.getRef}>
            {title && <div className={classes.head}>{title}</div>}
            <div className={classes.body} dangerouslySetInnerHTML={{ __html: content }} />
            <HalfBorder top={true}>
              <div className={classes.foot}>
                {button.map((item, index) => (
                  <Button key={index} classes={classes} item={item} onClick={this.onClick} />
                ))}
              </div>
            </HalfBorder>
          </div>
        </div>
      </>
    );
  }
}
